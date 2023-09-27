import { DateTime } from "luxon";

export interface IAdditionsMovements {
  id: number;
  additionId: number;
  type: string;
  managerCenter: string;
  projectId: number;
  fundId: number;
  budgetPosition: string;
  value: string;
}

export interface IAdditions {
  id?: number;
  actAdminDistrict: number;
  actAdminSapiencia: number;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime
}

export interface IAdditionsWithMovements {
  id?: number;
  actAdminDistrict: number;
  actAdminSapiencia: number;
  userModify?: string;
  dateModify?: Date;
  userCreate?: string;
  dateCreate?: DateTime;
  additionMove?: IAdditionsMovements[]
}

export interface IAdditionsFilters {
  page: number;
  perPage: number;
  adminDistrict?: string;
  adminSapiencia?: string;
  typeMovement?: string;
}

export interface IAdditionsForm{
  ingreso: IIncome[],
  gasto: IIncome[],
  actAdministrativeDistrict: string;
  actAdministrativeSapiencia: string;
  typeMovement: string;
}

export interface IIncome{
  managerCenter: string;
  projectId: string;
  projectName:string;
  functionalArea: string;
  funds: string;
  posPre: string;
  value: string;
  cardId:string;
}








export interface IData {
  head:    IHead[];
  details: IDetail[];
}

export interface IDetail {
  id:            number;
  additionId:    number;
  type:          string;
  budgetRouteId: number;
  value:         string;
  budgetRoute:   IBudgetRoute;
}

export interface IBudgetRoute {
  id:                   number;
  managementCenter:     string;
  div:                  string;
  idProjectVinculation: number;
  idFund:               number;
  idBudget:             number;
  idPospreSapiencia:    number;
  budget:               IBudget;
  pospreSapiencia:      IBudget;
  fund:                 IBudget;
  projectVinculation:   ProjectVinculation;
}

export interface IBudget {
  id:            number;
  number:        string;
  ejercise?:     number;
  denomination?: string;
  description:   string;
  consecutive?:  number;
}

export interface ProjectVinculation {
  id:               number;
  functionalAreaId: number;
  projectId:        string;
  conceptProject:   string;
  areaFuntional:    IBudget;
}

export interface IHead {
  id:                number;
  actAdminDistrict:  string;
  actAdminSapiencia: string;
}

export interface Operation {
  code: string;
}
