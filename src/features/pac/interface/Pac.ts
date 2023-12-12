import { DateTime } from 'luxon';
import { IDropdownProps } from '../../../common/interfaces/select.interface';
import { IDropdownPropsPac } from '../transferPac/interfaces/TypeTransferPac';

export interface IPac {
    id?: number;
    entityId: number;
    number: string;
    name: string;
    isActivated: number;
    exercise: number;
    dateFrom: string;
    dateTo: string;
    budgetValue: number;
    assignmentValue: number;
    userModify: string;
    dateModify: string;
    userCreate: string;
    dateCreate: string;
    pacAnnualizations?: IAnnualRoute[],
    sourceType?: string
};

export interface IPacFilters {
    pacType?: string;
    exercise?: number;
    sourceType?: string;
    managementCenter?: string;
    idProjectVinculation?: number;
    idBudget?: number;
    idPospreSapiencia?: number;
    idFund?: number;
    idCardTemplate?: string;
}

export interface IPacComplementary {
    headerComposition?: IPacFilters;
    listBudgetsRoutes?: number[];
    listProjects?: IDinamicListForProjects[];
    listFunds?: IDinamicListForFunds[];
    listPospreSapi ?: IDinamicListForPospres[];
    candidatesRoutes?: number[];
}

export interface IDinamicListForProjects {
    idVinculation: number;
    idProjectPlanning: number;
    projectCode: string;
    posPreSapiRef?: string;
    projectName: string;
    numberFunctionalArea: string;
}

export interface IDinamicListForFunds {
    idFund: number;
    fundCode: string;
}

export interface IDinamicListForPospres {
    idPosPreSapi: number;
    numberCodeSapi: string;
    descriptionSapi: string;
    idPosPreOrig: number;
    numberCodeOrig: string;
}

export interface IPacAnnualAdapter {
    pacType: string; 
    exercise: number;
    resourceType: string;
  
    managementCenter: string;
    idProjectVinculation: number;
    idBudget: number;
    idPospreSapiencia: number;
    idFund: number;
    idCardTemplate: string;
    numberFunctionalArea?: number;
    projectName?: string;
    idRouteComplete?: number;
}

export interface DataTransferPac {
    headTransfer:        HeadTransfer;
    transferTransaction: TransferTransaction;
}
  
export interface HeadTransfer {
    pacType:      string;
    exercise:     number;
    resourceType: string;
}
  
export interface TransferTransaction {
    origins:     IDestinity[];
    destinities: IDestinity[];
}
  
export interface IDestinity {
    managementCenter:     string;
    idProjectVinculation: number;
    idBudget:             number;
    idPospreSapiencia:    number;
    idFund:               number;
    idCardTemplate:       string;
    annualRoute:          IAnnualRoute[];
}

export interface IAnnualRoute {
    id?:  number;
    pacId?: number;
    type: string;
    jan:  number;
    feb:  number;
    mar:  number;
    abr:  number;
    may:  number;
    jun:  number;
    jul:  number;
    ago:  number;
    sep:  number;
    oct:  number;
    nov:  number;
    dec:  number;
    dateModify?: string;
    dateCreate?: string;
    cardId?: string,
    ubicacion?: string
}

export interface IResultSearchAnnualizationByRoute {
    headerResult: IPacFilters;
    routeResult: IBudgetsRoutesSimple;
    annualRoute: IAnnualRoute[];
    idCardTemplate?: string
}

export interface IBudgetsRoutesSimple {
    id?: number;
    idProjectVinculation?:number;
    managementCenter?:string;
    div?:string;
    idBudget?:number;
    idPospreSapiencia?:number;
    idFund?:number;
    userModify?: string;
    dateModify?: Date;
    userCreate?: string;
    dateCreate?: DateTime;
}

export interface IHeadPac {
    exercise:number;
    typePac:string;
    typeSource:string;
    file:any;
    userCreate?:string;
    userModify?:string;
}

export interface IErrorTablePac{
    message:number;
    error:string;
} 

export interface IPacSearch {
    exercise: string,
    resourceType: string,
    version: string,
    idProjectVinculation: number,
    idBudget: number,
    idPospreSapiencia: number,
}

export interface IArrayDataSelectPacComplementary{
    headerComposition?: IPacFilters;
    listBudgetsRoutes?: IDropdownProps[];
    listProjects?: IDropdownProps[];
    listFunds?: IDropdownProps[];
    listPospreSapi ?: IDropdownProps[];
}

export interface IArrayDataSelectPacAssociate{
    headerComposition?: IPacFilters;
    listBudgetsRoutes?: IDropdownPropsPac[];
    listProjects?: IDropdownPropsPac[];
    listFunds?: IDropdownPropsPac[];
    listPospreSapi ?: IDropdownPropsPac[];
}

export interface ICreateAssociation {
    exercise?: number;
    resourceType?: string;
    route?: number;
    pacId?: number;
    type?: string;
    version?: number;
    idProjectVinculation?: number;
    idFund?: number;
    idPospreSapiencia?: number;
    idBudget?: number;
    budgetSapiencia?: number;
    annualization?: IAnnualRoute;
    userModify?:string;
    userCreate?:string;
}

export interface IPacEdit {
    pacType: string,
    managerCenter: string,
    pospre: string,
    pospreSapiencia: number,
    fundsSapiencia: string,
    funds: string,
    functionalArea: string,
    project: string,
    projectName: string,
    budgetSapi: string,
    exercise: string
    totalProgrammed: string,
    totalCollected: string,
    resourceType: string,
    programmed: {
        [key: string]: string;
    };
    collected: {
        [key: string]: string;
    };
}

export interface IResultSearchDinamicPac {
    resultPac : IPac | null,
    totalsPac : {
      totalProgramming : number;
      totalCollected : number;
    }
    resultRoute: {
      managementCenter : string;
      fundNumber : string;
      fundId : number;
      posPreSapiDescription : string;
      posPreSapiNumber : string;
      posPreSapiId : number;
      posPreOrigNumber : string;
      posPreOrigId : number;
      projectVinculationId : number;
      projectPlanningId : number;
      projectCode : string;
      projectName : string;
      functionalAreaId : number;
      functionalAreaNumber : string;
    }
  }
  
export interface IEditPac  {
    id?: number,
    route?: number;
    pacId?: number;
    budgetRouteId?: number;
    type?: string;
    version?: number;
    resourceType?: string;
    pacType?: string;
    idProjectVinculation?: number;
    idFund?: number;
    idPospreSapiencia?: number;
    idBudget?: number;
    budgetSapiencia?: number;
    totalProgramming?: number;
    totalCollected?: number;
    annProgrammingPac?: IAnnualRoute;
    annCollectyerPac?: IAnnualRoute;
    dataCondensed?: ISearchGeneralPac;
}

export interface ISearchGeneralPac {

    projectName: string;
    numberFund: string | number;
    posPreSapi: string | number;
    budgetSapi: string | number;
    budgetCollected: string | number;
    percentExecute: number;
  
    pacId?: number;
    routeId?: number;
    posPreOrig?: string | number;
  
    projectVinculationId?: number;
    fundId?: number;
    posPreSapiId?: number;
    posPreOrigId?: number;
  
}

export interface IViewPacComplete {

    managementCenter: string;
    fundNumber: string;
    posPreSapiNumber: string;
    projectCode: string;
    projectName: string;
    posPreOrig: string;
    functionalAreaNumber: string;
    totalProgrammingAnnual: number;
    totalCollectedAnnual: number;
    percentExecuteAnnual: number;
    forCollected: number;
    Jan : {
      totalProgrammingJan: number;
      totalCollectedJan: number;
      executeJan: number;
      diferenceJan: number;
    },
    Feb : {
      totalProgrammingFeb: number;
      totalCollectedFeb: number;
      executeFeb: number;
      diferenceFeb: number;
    },
    Mar : {
      totalProgrammingMar: number;
      totalCollectedMar: number;
      executeMar: number;
      diferenceMar: number;
    },
    Abr : {
      totalProgrammingAbr: number;
      totalCollectedAbr: number;
      executeAbr: number;
      diferenceAbr: number;
    },
    May : {
      totalProgrammingMay: number;
      totalCollectedMay: number;
      executeMay: number;
      diferenceMay: number;
    },
    Jun : {
      totalProgrammingJun: number;
      totalCollectedJun: number;
      executeJun: number;
      diferenceJun: number;
    },
    Jul : {
      totalProgrammingJul: number;
      totalCollectedJul: number;
      executeJul: number;
      diferenceJul: number;
    },
    Ago : {
      totalProgrammingAgo: number;
      totalCollectedAgo: number;
      executeAgo: number;
      diferenceAgo: number;
    },
    Sep : {
      totalProgrammingSep: number;
      totalCollectedSep: number;
      executeSep: number;
      diferenceSep: number;
    },
    Oct : {
      totalProgrammingOct: number;
      totalCollectedOct: number;
      executeOct: number;
      diferenceOct: number;
    },
    Nov : {
      totalProgrammingNov: number;
      totalCollectedNov: number;
      executeNov: number;
      diferenceNov: number;
    },
    Dec : {
      totalProgrammingDec: number;
      totalCollectedDec: number;
      executeDec: number;
      diferenceDec: number;
    }
  
}