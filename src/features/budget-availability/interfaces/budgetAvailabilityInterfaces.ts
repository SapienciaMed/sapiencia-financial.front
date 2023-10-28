import { DateTime } from "luxon";

export interface IBudgetsAvailabilityFilters {
  page: number;
  perPage: number;
  dateOfCdp: string;
  consecutiveSap?: string;
  consecutiveAurora?: string;
  projectId?: string;
  fundId?: string;
  pospreId?: string;
  initialDate?: string;
  endDate?: string;
  contractObject?: string;
}

export interface IFiltersSelect {
  pospreId: any[];
  fundId: any[];
  projectId: any[];
}


export interface IBudgetAvalaibility {
  id?: number;
  exercise:string;
  date: DateTime;
  contractObject: string; 
  consecutive: number;
  sapConsecutive: number;
  rpAssoc?:string;
  amounts: IAmounts[];
}


interface IAmounts {
  id?:number;
  exercise: string;
  cdpCode:number;
  idRppCode:number;
  cdpPosition:number;
  amount:number;
  rpAssocs?: string;
  isActive: boolean;
  reasonCancellation: string;
  
}