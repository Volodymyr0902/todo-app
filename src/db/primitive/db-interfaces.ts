export interface Document {
  id: number;
  text: string;
  checked: boolean;
}

export interface LocalDB {
  idCounter: number;
  items: Document[];
}