export interface IItemsCollection {
  items: ISingleItem[];
}

export interface ISingleItem{
  _id: string;
  text: string;
  checked: boolean;
}

export interface Document {
  _id: number;
  text: string;
  checked: boolean;
}