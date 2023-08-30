import { DateTime } from "luxon";
import { IEntities } from "./Entities";

export interface IFunds {
  id?: number;
  entityId: number;
  number: number;
  denomination: string;
  description: string;
  dateFrom: Date;
  dateTo: Date;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
  entity?: IEntities
}

export interface IFundsFilters {
  page: number;
  perPage: number;
  entity?: number;
  number?: string;
  dateFrom?: DateTime;
  dateTo?: DateTime;
}