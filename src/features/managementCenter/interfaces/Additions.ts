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
  projectId: string | number;
  projectName:string;
  functionalArea: string | number;
  funds: string | number;
  posPre: string | number;
  value: string;
  cardId:string;
}


export interface IData {
  head:    Head[];
  details: Detail[];
  id: number
}

export interface Detail {
  id:            number;
  additionId:    number;
  type:          string;
  budgetRouteId: number;
  value:         string;
  budgetRoute:   BudgetRoute;
}

export interface BudgetRoute {
  id:                   number;
  managementCenter:     string;
  div:                  string;
  idProjectVinculation: number;
  idFund:               number;
  idBudget:             number;
  idPospreSapiencia:    number;
  budget:               Budget;
  pospreSapiencia:      Budget;
  fund:                 Budget;
  projectVinculation:   ProjectVinculation;
}

export interface Budget {
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
  areaFuntional:    Budget;
}

export interface Head {
  id:                number;
  actAdminDistrict:  string;
  actAdminSapiencia: string;
  typeMovement?: string;
}