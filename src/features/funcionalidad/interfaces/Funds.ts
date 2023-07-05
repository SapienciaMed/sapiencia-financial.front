import { DateTime } from "luxon";

export interface IFounds {
  id: number;
  entityId: number;
  entity: string;
  number: number
  dateFrom: DateTime;
  dateTo: DateTime;
  userModify: DateTime;
  dateModify: DateTime;
  userCreate: string;
  dateCreate: DateTime;
}

export interface IFilterFounds {
  nombreRol: string;
  descripcionRol: string;
}