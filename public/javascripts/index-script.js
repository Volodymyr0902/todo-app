Vue.component("task", {
  props: ["data", "index"],
  template: `
<div class="task" v-bind:class="{ taskCompleted: data.checked}" >
<div class="contentText">
  <div>
      <button @click="$emit('task_done')" class="task_done taskButton">
          <span v-if="!data.checked" style="color: rgba(0,0,0,.28);"> ☐ </span>
          <span v-else style="color: #27ae60"> ☑ </span>
      </button>
      <span class="task_content" v-if="!data.editable">
          {{index}}. {{data.text}}
      </span>
      <span v-else>           
          {{index}}. <input @keyup.enter="$emit('save')" v-model="data.inputedit" autofocus class="edit-input"/>
      </span>
  </div>
  <div class="button check" v-if="!data.editable">
      <button @click="$emit('task_edit')" style="color: #eca81a;"> ✎️ </button>
      <button @click="$emit('task_del')" style="color: #cd1537;"> ✕ </button>
  </div>
  <div v-else>
      <button @click="$emit('save')"> 💾 </button>
      <button @click="$emit('disable')"> ✕ </button>
  </div>
</div>  
</div>
`
});

let vue = new Vue({
  el: '#app',
  data: {
      new_task: {
          text: '',
          editable: false,
          checked: false
      },
      tasks: [
      ],
      login: '',
      pass: '',
      backendLanguage: 'JS',
      apiURL: 'http://localhost:8080/api/',
      apiVersion: 'v1',
      step: ''
  },
  computed: {
      backendSuffix() {
          return this.backendLanguage === 'PHP' ? '.php' : '';
      },
  },
  methods: {
      getTasks: function () {
          const route = this.apiVersion === 'v1' ? '/items' : '/router';
          const qs = {action: this.apiVersion === 'v1' ? '' : 'getItems'};
          fetch(this.apiURL + this.apiVersion + route + this.backendSuffix + '?' + new URLSearchParams(qs), { 
              credentials: 'include',
              method: this.apiVersion === 'v1' ? 'GET' : 'POST',
          })
              .then(res => res.json())
              .then((response) => {
                  if (response.error === 'forbidden') {
                      this.step = 'login';
                  } else {
                      this.tasks = response.items.map((item) => {
                          item.editable = false;
                          return item;
                      })
                      this.step = 'items';
                  }
              }).catch((error) => {
                  this.step = 'error';
              })
      },
      deleteTask: function (index) {
          let request = JSON.stringify({ _id: index, });
          const route = this.apiVersion === 'v1' ? '/items' : '/router';
          const qs = {action: this.apiVersion === 'v1' ? '' : 'deleteItem'};
          fetch(this.apiURL + this.apiVersion + route + this.backendSuffix + '?' + new URLSearchParams(qs), {
              method: this.apiVersion === 'v1' ? 'DELETE' : 'POST',
              body: request,
              credentials: 'include',
              headers: {
                  'Content-Type': 'application/json'
              },
          }).then(res => res.json())
              .then((response) => {
                  if (response['ok'] === true) {
                      this.getTasks()
                  } else {
                      alert("An error occured. Open DevTools for details.")
                  }
              });
      },
      addTask: function () {
          if (this.new_task.text.trim() !== '') {
              let request = JSON.stringify({ text: this.new_task.text });
              const route = this.apiVersion === 'v1' ? '/items' : '/router';
              const qs = {action: this.apiVersion === 'v1' ? '' : 'createItem'};
              fetch(this.apiURL + this.apiVersion + route + this.backendSuffix + '?' + new URLSearchParams(qs), {
                  method: this.apiVersion === 'v1' ? 'POST' : 'POST',
                  body: request,
                  credentials: 'include',
                  headers: {
                      'Content-Type': 'application/json'
                  },
              }).then(res => res.json())
                  .then((response) => {
                      if (response._id) {
                          this.getTasks();
                          this.$set(this.new_task, 'text', '');
                      } else {
                          alert("An error occured. Open DevTools for details.")
                      }
                  });
          }
      },
      updateTask: function (index, id) {
          let request = JSON.stringify({ text: this.tasks[index].text, _id: id, checked: this.tasks[index].checked });
          const route = this.apiVersion === 'v1' ? '/items' : '/router';
          const qs = {action: this.apiVersion === 'v1' ? '' : 'editItem'};
          fetch(this.apiURL + this.apiVersion + route + this.backendSuffix + '?' + new URLSearchParams(qs), {
              method: this.apiVersion === 'v1' ? 'PUT' : 'POST',
              body: request,
              credentials: 'include',
              headers: {
                  'Content-Type': 'application/json'
              },
          })
              .then(res => res.json())
              .then(() => {
                  this.getTasks()
              });
      },
      markAsDone(index, id) {
          this.$set(this.tasks[index], 'checked', this.tasks[index].checked === false)
          this.checked = this.tasks[index].checked;
          this.updateTask(index, id)
      },
      editTask(index) {
          this.$set(this.tasks[index], 'editable', true);
          this.$set(this.tasks[index], 'inputedit', this.tasks[index].text);
      },
      save(index, id) {
          if (this.new_task.text !== '' || this.new_task.text !== ' ') {
              this.$set(this.tasks[index], 'text', this.tasks[index].inputedit);
              this.updateTask(index, id);
              this.$set(this.tasks[index], 'editable', false);

          }
      },
      disable(index) {
          this.$set(this.tasks[index], 'editable', false);
          this.$set(this.tasks[index], 'inputedit', '');
      },
      logout() {
          const route = this.apiVersion === 'v1' ? '/logout' : '/router';
          const qs = {action: this.apiVersion === 'v1' ? '' : 'logout'};
          fetch(this.apiURL + this.apiVersion + route + this.backendSuffix + '?' + new URLSearchParams(qs), {
              method: this.apiVersion === 'v1' ? 'POST' : 'POST',
              credentials: "include",
          }).then(res => res.json())
              .then((response) => {
                  if (response.ok) {
                      localStorage.clear();
                      this.step = 'login';
                  }
              });
      },
      logIn() {
          if (this.login.trim() !== '' && this.pass.trim()) {
              let params = JSON.stringify({ login: this.login, pass: this.pass });
              const route = this.apiVersion === 'v1' ? '/login' : '/router';
              const qs = {action: this.apiVersion === 'v1' ? '' : 'login'};
              document.querySelectorAll(".LoginInput input").forEach((input) => {input.value = ''});
              this.login = '';
              this.pass = '';
              fetch(this.apiURL + this.apiVersion + route + this.backendSuffix + '?' + new URLSearchParams(qs), {
                  method: this.apiVersion === 'v1' ? 'POST' : 'POST',
                  credentials: 'include',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: params
              })
                  .then(res => res.json())
                  .then(response => {
                      if (response.ok) {
                          localStorage.setItem('name', this.login);
                          this.getTasks();
                          this.step = 'items';
                      } else if (response.error === 'not found') {
                          alert("Such user doesn't exist");
                      } else {
                          alert("An error occured. Open DevTools for details.")
                      }
                  })
          }
      },
      register() {
          if (this.login.trim() !== '' && this.pass.trim()) {
              let params = JSON.stringify({ login: this.login, pass: this.pass });
              const route = this.apiVersion === 'v1' ? '/register' : '/router';
              const qs = {action: this.apiVersion === 'v1' ? '' : 'register'};
              fetch(this.apiURL + this.apiVersion + route + this.backendSuffix + '?' + new URLSearchParams(qs), {
                  method: this.apiVersion === 'v1' ? 'POST' : 'POST',
                  body: params,
                  headers: {
                      'Content-Type': 'application/json'
                  },
              })
                  .then(res => res.json())
                  .then((response) => {
                      if (response.ok) {
                          this.logIn();
                      } else {
                          alert(response.error)
                      }
                  });
          }
      },
  },
  mounted: function() {
    this.getTasks()
  }
});