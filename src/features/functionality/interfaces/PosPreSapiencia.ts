import { DateTime } from "luxon";
import { IBudgets } from "./Budgets";

export interface IPosPreSapiencia {
  id?: number;
  number?: string;
  budgetId: number;
  ejercise: number;
  description: string;
  consecutive: number;
  assignedTo: string;
  userModify?: string;
  dateModify?: Date | string;
  userCreate?: string;
  dateCreate?: DateTime;
  budget?: IBudgets;
}


export interface IFiltersPosPreSapiencia {
  page: number;
  perPage: number;
  budgetId: number;
}

export interface IPospreSapienciaData{
  budgetsId: string,
  validateAction?: "new" | "view" | "edit" | "delete",
  budgetsData?: string,
  upDatePospreData?: (pospreSapi: any) => void,
}
