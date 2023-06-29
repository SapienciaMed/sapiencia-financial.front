export interface ITableElement<T> {
  header: string;
  fieldName: string;
  mobile: boolean;
  required?: boolean;
  dataList?: IListTableElement[];
  renderCell?: (row: T) => JSX.Element;
  width?: string | number;
}

export interface IListTableElement {
  id: string | number;
  value: string;
}

export interface ITableAction<T> {
  icon: "Detail" | "Edit" | "Delete";
  onClick: (row: T) => void;
  customName?: string;
}
