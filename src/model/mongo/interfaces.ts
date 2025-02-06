export interface ITodosCollection {
  items: ISingleTodo[];
}

export interface ISingleTodo{
  _id: string;
  text: string;
  checked: boolean;
  userID: string;
}

export interface IUser {
  login: string;
  pass: string;
}