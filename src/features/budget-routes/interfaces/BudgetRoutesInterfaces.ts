import { DateTime } from "luxon";
import { IFunds } from "../../functionality/interfaces/Funds";
import { IBudgets } from "../../functionality/interfaces/Budgets";
import { IProjectsVinculate } from "../../functionality/interfaces/Projects";
import { IPosPreSapiencia } from "../../functionality/interfaces/PosPreSapiencia";
import { IFunctionalArea } from "../../functionality/interfaces/Functional-Area";

export interface IBudgetsRoutes {
  id?: number;
  idProjectVinculation:number;
  managementCenter:string;
  div:string;
  idBudget:number;
  idPospreSapiencia:number;
  idFund:number;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
  projectVinculation?:IProjectsVinculate;
  pospreSapiencia?:IPosPreSapiencia;
  functionalArea?: IFunctionalArea,
  budget?:IBudgets;
  fund?:IFunds;
}

export interface IBudgetsRoutesFilters {
  page: number;
  perPage: number;
  idProjectVinculation?: string;
}

export interface IBudgetsRoutesCrudForm {
  idProjectVinculation: number;
  managementCenter: string;
  div: string;
  functionalArea: string;
  idBudget: number;
  idPospreSapiencia: number;
  idFund: number;
}