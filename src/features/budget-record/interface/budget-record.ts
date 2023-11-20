

export interface IBudgetRecord {
    id?: number;
    supplierType: string;
    supplierId: number;

    supplierName?: string;

    contractorDocument: string;
    documentDate: any;
    dateValidity: any;
    dependencyId: number;
    contractualObject: string;
    componentId: number;

    consecutiveCdpSap?: number;
    consecutiveCdpAurora?: number;
    consecutiveSap?: number;
    //newAmount?:any;
    contractNumber?: string;
    responsibleDocument?: string;
    supervisorDocument?: string;
    userCreate?: string;
    userModify?: string;
    dateCreate?: string;
    dateModify?: string;
    newAmount?: number;
    maxAMount?: number;
    mountSelected?: number;
    linksRp?: ILinkRPCDP[];
}

export interface IBudgetRecordv2 {
    id?: number;
    supplierType?: string;
    supplierName?:string;
    consecutiveCdpSap?:number;
    consecutiveCdpAurora?:number;
    supplierId?: number;
    contractorDocument?: string;
    documentDate?: Date;
    dateValidity?: Date;
    dependencyId?: number;
    contractualObject?: string;
    componentId?: number;
    consecutiveSap?: number;
    contractNumber?: string;
    responsibleDocument?: string;
    supervisorDocument?: string;
    userCreate?: string;
    userModify?: string;
    dateCreate?: string;
    dateModify?: string;
    linksRp?: ILinkRPCDP[];
    creditor?: any[];
    idAmountToModify?:number;
    newAmount?:number;
    maxAmount?:number;

}


export interface ILinkRPCDP {
    id?: number;
    rpId: number;
    amountCdpId?: number;
    initialAmount?: number;
    isActive?: boolean;
    reasonCancellation?: string;
    creditAmount?:number;
    againtsAmount?:number;
    fixedCompleted?:number;
    finalAmount?:number;
    position?:number;
    observation?:string;
    amountBudgetAvailability?:any[];
    budgetRecord?:any[];
}

export interface IBudgetRecordFilter {
    consecutivoRpSap?: string;
    consecutiveRpAurora?: string;
    supplierType?: string;
    contractorDocument?: string;
    supplierName?: string;
    supplierId?: number;
    rpId?: number;
    reasonCancellation?: string;
    taxIdentificationId?:string;
}

/* export interface IBudgetRecordEditBasic {
    id:number;
    dependencyId?:number;
    contractualObject?:string;
    componentId?:number;
    consecutiveRpSap?:number;
    documentDate?:any;
    dateValidity?:any;
    contractNumber?:string;
    responsibleDocument?:string;
    supervisorDocument?:string;
} */