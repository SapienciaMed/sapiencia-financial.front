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
  entity: number;
  funds: string;
  dateFrom: DateTime;
  dateTo: DateTime;
}