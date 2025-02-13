export interface Document {
  _id: number;
  text: string;
  checked: boolean;
}

export interface LocalDB {
  idCounter: number;
  items: Document[];
}