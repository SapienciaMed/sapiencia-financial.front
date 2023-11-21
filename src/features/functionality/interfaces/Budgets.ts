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
  entity?: IEntities,
  pospresap?: any[]
  vinculationmga?: any[]
}

export interface IBudgetViewPage {
  actions: "vinculation" | "edit" | "view",
  unlinkMGA?: (value: boolean) => void,
  upDatePospreData?: (pospreSapi: any) => void,
  upDateVinculationData?: (vinculationmga: any[]) => void
}

