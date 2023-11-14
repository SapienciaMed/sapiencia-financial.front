export interface IRP {
    id: number;
    supplierType: string;
    supplierId: number;
    contractorDocument: string;
    documentDate: string;
    dateValidity: string;
    dependencyId: number;
    contractualObject: string;
    componentId: number;
    userCreate: string | null;
    userModify: string | null;
    dateCreate: string;
    dateModify: string | null;
    consecutiveSap: string | null;
    contractNumber: string | null;
    responsibleDocument: string | null;
    supervisorDocument: string | null;
    creditor: Creditor;
    linksRp: LinkRp[];
}

export interface Creditor {
    id: number;
    typeDocument: string;
    document: string;
    taxIdentification: string;
    name: string;
    city: string;
    address: string;
    phone: number;
    email: string;
    userModify: string;
    userCreate: string | null;
    dateCreate: string;
    dateModify: string | null;
}

export interface LinkRp {
    id: number;
    rpId: number;
    amountCdpId: number;
    initialAmount: number;
    isActive: number;
    reasonCancellation: string;
    position: number | null;
    creditAmount: number | null;
    againtsAmount: number | null;
    fixedCompleted: number | null;
    finalAmount: number | null;
    projectName: string;
    amountBudgetAvailability: AmountBudgetAvailability;
}

export interface AmountBudgetAvailability {
    id: number;
    cdpCode: number;
    idRppCode: number;
    cdpPosition: number;
    amount: string;
    isActive: number;
    reasonCancellation: string;
    modifiedIdcCountercredit: string;
    idcModifiedCredit: string;
    idcFixedCompleted: string;
    idcFinalValue: string;
    budgetRoute: BudgetRoute;
}

export interface BudgetRoute {
    id: number;
    idProjectVinculation: number;
    managementCenter: string;
    div: string;
    idBudget: number;
    idPospreSapiencia: number;
    idFund: number;
    initialBalance: string;
    balance: string;
    userModify: string;
    dateModify: string;
    userCreate: string;
    dateCreate: string;
    budget: Budget;
    fund: Fund;
    pospreSapiencia: PospreSapiencia;
    projectVinculation: ProjectVinculation;
}

export interface Budget {
    id: number;
    number: string;
    ejercise: number;
    entityId: number;
    denomination: string;
    description: string;
    userModify: string;
    dateModify: string;
    userCreate: string;
    dateCreate: string;
}

export interface Fund {
    id: number;
    entityId: number;
    number: string;
    denomination: string;
    description: string;
    dateFrom: string;
    dateTo: string;
    userModify: string;
    dateModify: string;
    userCreate: string;
    dateCreate: string;
}

export interface PospreSapiencia {
    id: number;
    number: string;
    budgetId: number;
    ejercise: number;
    description: string;
    consecutive: string;
    assignedTo: string;
    userCreate: string;
    dateModify: string;
    dateCreate: string;
    userModify: string;
}

export interface ProjectVinculation {
    id: number;
    functionalAreaId: number;
    linked: boolean;
    type: string;
    operationProjectId: number | null;
    investmentProjectId: number;
    userCreate: string;
    dateCreate: string;
    functionalProject: string | null;
}

// Estructura del objeto completo
export interface ApiResponse {
    data: IRP[];
    operation: {
        code: string;
        message: string;
    };
}
