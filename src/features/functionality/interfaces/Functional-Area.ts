export interface IFunctionalAreaFilters {
  page: number;
  perPage: number;
  number?: number;
}

export interface IFunctionalArea {
  id?: number;
  number: number;
  denomination: string;
  description: string;
}

export interface IFunctionalAreaCrud {
  number: number;
  denomination: string;
  description: string;
}