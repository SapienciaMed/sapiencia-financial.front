export interface IRoutesCDP {
    id?:                       number;
    cdpCode?:                  number;
    idRppCode?:                number;
    cdpPosition?:              number;
    amount?:                   string;
    isActive?:                 number;
    reasonCancellation?:       string;
    modifiedIdcCountercredit?: string;
    idcModifiedCredit?:        string;
    idcFixedCompleted?:        string;
    idcFinalValue?:            string;
    budgetAvailability?:       BudgetAvailability;
    budgetRoute?:              BudgetRoute;
}

export interface BudgetAvailability {
    id?:             number;
    date?:           Date;
    contractObject?: string;
    consecutive?:    number;
    sapConsecutive?: number;
    exercise?:       string;
}

export interface BudgetRoute {
    id?:                   number;
    idProjectVinculation?: number;
    managementCenter?:     string;
    div?:                  string;
    idBudget?:             number;
    idPospreSapiencia?:    number;
    idFund?:               number;
    balance?:              string;
    userModify?:           string;
    dateModify?:           Date;
    userCreate?:           string;
    dateCreate?:           Date;
    budget?:               Budget;
    fund?:                 Budget;
    pospreSapiencia?:      PospreSapiencia;
    projectVinculation?:   ProjectVinculation;
}

export interface Budget {
    id?:           number;
    number?:       string;
    ejercise?:    number;
    entityId?:     number;
    denomination?: string;
    description?:  string;
    userModify?:   string;
    dateModify?:   Date;
    userCreate?:   string;
    dateCreate?:   Date;
    dateFrom?:    Date;
    dateTo?:      Date;
}

export interface PospreSapiencia {
    id?:          number;
    number?:      string;
    budgetId?:    number;
    ejercise?:    number;
    description?: string;
    consecutive?: string;
    assignedTo?:  string;
    userCreate?:  string;
    dateModify?:  Date;
    dateCreate?:  Date;
    userModify?:  string;
}

export interface ProjectVinculation {
    id?:                  number;
    functionalAreaId?:    number;
    linked?:              boolean;
    type?:                string;
    operationProjectId?:  null;
    investmentProjectId?: number;
    userCreate?:          string;
    dateCreate?:          Date;
    functionalProject?:   null;
}

export interface IUpdateRoutesCDP {
  id?:                       number;
  idRppCode:                 number;
  cdpPosition:               number;
  amount:                    number;
  modifiedIdcCountercredit?: number;
  idcModifiedCredit?:        number;
  idcFixedCompleted?:        number;
  idcFinalValue?:            number;
}
