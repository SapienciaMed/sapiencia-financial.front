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
  mgaId?:number;
  active?:boolean;
}

export interface IApiPlanningDetailedActivitiesSpecify {

  activityDetailedId: number;           
  consecutiveActivityDetailed: string;   
  detailActivityDetailed: string;       
  amountActivityDetailed: number;       
  measurementActivityDetailed: number;  
  unitCostActivityDetailed: number;     
  totalCostActivityDetailed: number;    
  activityId: number;                   
  codeMga: number;                      
  codeConsecutiveProductMga: string;    
  productDescriptionMGA: string;        
  codeConsecutiveActivityMga: string;   
  activityDescriptionMGA: string;      

}