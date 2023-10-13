
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
    dateCreate: string
};

export interface IPacFilters {
    pacType?: string;
    exercise?: number;
    sourceType?: string;
}

export interface IPacComplementary {
    headerComposition?: IPacFilters;
    listBudgetsRoutes?: number[];
    listProjects?: IDinamicListForProjects[];
    listFunds?: IDinamicListForFunds[];
    listPospreSapi ?: IDinamicListForPospres[];
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