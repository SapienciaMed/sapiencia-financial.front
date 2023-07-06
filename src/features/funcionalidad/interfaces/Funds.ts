import { DateTime } from "luxon";
import { IEntities } from "./Entities";

export interface IFunds {
  id?: number;
  entityId: number;
  number: number;
  denomination: string;
  description: string;
  dateFrom: DateTime;
  dateTo: DateTime;
  userModify?: string;
  dateModify?: DateTime;
  userCreate: string;
  dateCreate: DateTime;
  entity?: IEntities
}

export interface IFundsFilters {
  page: number;
  perPage: number;
  entity?: number;
  number?: number;
  dateFrom?: DateTime;
  dateTo?: DateTime;
}