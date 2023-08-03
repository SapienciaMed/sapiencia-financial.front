import { DateTime } from 'luxon';

export interface IFunctionalAreaFilters {
  page: number;
  perPage: number;
  number?: number;
}

export interface IFunctionalArea {
  id?: number;
  number: string;
  denomination: string;
  description: string;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IFunctionalAreaCrud {
  number: string;
  denomination: string;
  description: string;
}