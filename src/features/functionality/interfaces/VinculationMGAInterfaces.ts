import { DateTime } from "luxon";


export interface IActivityMGA {
  id: number;
  description: string;
  unit: string;
  quantity: number;
  cost: number;
  vinculation:IVinculationMGA|null;
}

export interface IVinculationMGA {
  id?: number;
  mgaId: number;
  budgetId: number;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IFiltersVinculationMGA {
  page: number;
  perPage: number;
  budgetId: number;
}
