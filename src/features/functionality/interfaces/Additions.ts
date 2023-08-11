import { DateTime } from "luxon";

export interface IAdditionsMovements {
  id: number;
  additionId: number;
  type: string;
  managerCenter: string;
  projectId: number;
  fundId: number;
  budgetPosition: string;
  value: number;
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
}
