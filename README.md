This repository contains RESTful API of a TODO application.
It does support SSR on root endpoint, besides the repo todo-client may be used as a client.

Application is based on Node.js and its Express library, written in TypeScript.
Transpiled files ready-to-use are in <code>/dist</code> directory.

It may be executed in several ways:
- branch MASTER contains 2 executive files:
    - <code>app-json.js</code> - local JSON file is used as data storage
    - <code>app-mongo.js</code> - MongoDB is used (mongodb module)
- branch MYSQL contains <code>app-mysql.js</code> which uses MySQL.

This app supports environmental variables so for complete support it's best to provide your own values:
- HOST
- PORT
- CLIENT
- SESSION_NAME
- SESSION_SECRET

Ones for MySQL:
- DB_HOST
- DB_PORT
- DB_USER
- DB_PASS
  
Ones for Mongo:
- DB_URI
- DB_NAME
- TODOS_COLLECTION
- USERS_COLLECTION
- SESSIONS_COLLECTION

So, Mongo/MySQL must be previously installed as well as node and npm in order to run this app.

Note: MySQL version always configures database on each run.

To run app:
1. Clone this repository.
2. Run npm install to intall all dependencies.
3. Run <code>npm run start</code> to run transpiled application or <code>npm run setup</code> if .ts code was edited.
