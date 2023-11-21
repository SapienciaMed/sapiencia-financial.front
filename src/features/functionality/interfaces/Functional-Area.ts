import { DateTime } from 'luxon';
import { IProjectsVinculation } from './Projects';

export interface IFunctionalAreaFilters {
  page: number;
  perPage: number;
  number?: string;
}

export interface IFunctionalArea {
  id?: number;
  number: string;
  denomination: string;
  description: string;
  userCreate?: string;
  dateCreate?: DateTime;

  projectsVinculation?: IProjectsVinculation[]
}

export interface IFunctionalAreaCrud {
  number: string;
  denomination: string;
  description: string;
}