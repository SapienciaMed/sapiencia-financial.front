import { DateTime } from "luxon";
import { IEntities } from "./Entities";

export interface IBudgets {
  id?: number;
  entityId: number;
  ejercise: number;
  number: string;
  denomination:string;
  description:string;
  userModify?: DateTime;
  dateModify?: Date;
  userCreate: string;
  dateCreate?: DateTime;
  entity?: IEntities
}

