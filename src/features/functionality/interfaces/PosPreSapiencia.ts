import { DateTime } from "luxon";
import { IBudgets } from "./Budgets";

export interface IPosPreSapiencia {
  id?: number;
  number: string;
  budgetId: number;
  ejercise: number;
  description: string;
  consecutive: number;
  assignedTo: string;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
  budget?: IBudgets;
}

export interface IFiltersPosPreSapiencia {
  page: number;
  perPage: number;
  budgetId: number;
}
