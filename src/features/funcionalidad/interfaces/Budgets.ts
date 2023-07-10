import { DateTime } from "luxon";
import { IEntities } from "./Entities";

export interface IBudgets {
  id?: number;
  entityId: number;
  ejercise: number;
  number:number;
  denomination:string;
  description:string;
  userModify?: DateTime;
  dateModify?: Date;
  userCreate: string;
  dateCreate?: DateTime;
  entity?: IEntities
}

export interface IFilterBudgets {
  page: number;
  perPage: number;
  entity?: number;
  ejercise?: number;
  number:number;
  denomination:string;
}
