import { DateTime } from "luxon";


export interface IActivityMGA {
  id: number;
  description: string;
  unit: string;
  quantity: number;
  cost: number;
  vinculation:IVinculationMGA|null;
}

export interface IDataActivityMGA{
  elementsDetail: IActivityMGA
}

export interface IVinculationMGA {
  id?: number;
  mgaId: number;
  budgetId: number;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IVinculationMgaV2 {
  id?: number;
  budgetId: number;
  activityId: number;
  consecutiveActivityDetailed: string;
  detailedActivityId: number;
  userCreate?: string;
}


export interface IFiltersVinculationMGA {
  page: number;
  perPage: number;
  budgetId: number;
  mgaId?:number;
  active?:boolean;
}

export interface ILastMoveEdit {
  id: IApiPlanningDetailedActivitiesSpecify
}

export interface IApiPlanningDetailedActivitiesSpecify {
  activityDetailedId: number;           
  consecutiveActivityDetailed: string;   
  detailActivityDetailed: string;       
  amountActivityDetailed: number;       
  measurementActivityDetailed: number;  
  measurementActivityDetailedName: string,
  unitCostActivityDetailed: number;     
  totalCostActivityDetailed: number;    
  activityId: number;                   
  codeMga: number;                      
  codeConsecutiveProductMga: string;    
  productDescriptionMGA: string;        
  codeConsecutiveActivityMga: string;   
  activityDescriptionMGA: string;
  idVinculation: number,
  id: number      
}

