import { DateTime } from 'luxon';
import { IFunctionalArea } from './Functional-Area';
export interface IAdditionsTransfersDistrictInterfaces {
    id: number | string;
    actAdminDistrict: string;
}

export interface IAdditionsTransfersSapienciaInterfaces {
    id: number | string;
    actAdminSapiencia: string;
}

export interface IProjectAdditionList { // akive
    id?: number;
    functionalAreaId: number;
    linked: boolean;
    type: string;
    investmentProjectId: number;
    operationProjectId: number;
    userCreate?: string;
    dateCreate?: DateTime;
  
    areaFuntional?: IFunctionalArea
  
    projectId: string;
    conceptProject: string;
    plannedValue: number;
    assignmentValue: number;
  }
  

export interface IFunctionalAreaAddition {
    id?: number;
    number: string;
    denomination: string;
    description: string;
}

export interface IFundsAdditionList {
    id?: number;
    entityId: number;
    number: string;
    denomination: string;
    description: string;
    dateFrom: DateTime;
    dateTo: DateTime;
    userModify?: string;
    dateModify?: Date;
    userCreate?: string;
    dateCreate?: DateTime;
    entity?: IEntitiesAddition
}

export interface IEntitiesAddition {
    id: number;
    name: string;
}

export interface IPosPreAddition {
    id?: number;
    number: string;
    budgetId: number;
    ejercise: number;
    description: string;
    consecutive: number;
    assignedTo: string;
    userModify?: string;
    dateModify?: Date;
    userCreate?: string;
    dateCreate?: DateTime;
}

export interface IPosPreSapienciaAdditionList {
    id?: number;
    number: string;
    budgetId: number;
    ejercise: number;
    description: string;
    consecutive: number;
    assignedTo: string;
    userModify?: string;
    dateModify?: Date;
    userCreate?: string;
    dateCreate?: DateTime;
    budget?: IBudgetsAddition;
}

export interface IBudgetsAddition {
    id?: number;
    entityId: number;
    ejercise: number;
    number:string;
    denomination:string;
    description:string;
    userModify?: string;
    dateModify?: Date;
    userCreate?: string;
    dateCreate?: DateTime;
}
