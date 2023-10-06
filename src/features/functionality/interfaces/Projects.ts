import { DateTime } from "luxon";
import { IFunctionalArea } from "./Functional-Area";

export interface IProject {
  id: string;
  type: string;
  projectCode: string;
  name: string;
  plannedValue: number;
  assignmentValue: number;
  linked?: number;
}

export interface IProjectFilters {
  page: number;
  perPage: number;
  id: string;
}

export interface IProjectsVinculation {
  id?: number;
  functionalAreaId?: number;
  projectId: string;
  budgetValue: number;
  linked: boolean;
  userCreate?: string;
  dateCreate?: DateTime;
}


export interface IProjectsVinculate {
  idFunctionalArea: number;
  projects: {
    id: any;
    linked: boolean;
  }[];
  userCreate?: string;
}
