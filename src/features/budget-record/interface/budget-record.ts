

export interface IBudgetRecord {
    id?: number;
    supplierType: string;
    supplierId: number;
    
    supplierName?:string;
    
    contractorDocument: string;
    documentDate: any;
    dateValidity: any;
    dependencyId: number;
    contractualObject: string;
    componentId: number;
    
    consecutiveCdpSap?:number;
    consecutiveCdpAurora?:number;
    consecutiveSap?:number;
    //newAmount?:any;
    contractNumber?:string;
    responsibleDocument?:string;
    supervisorDocument?:string;
    userCreate?:string;
    userModify?:string;
    dateCreate?:string;
    dateModify?:string;
    newAmount?:number;
    linksRp?: ILinkRPCDP[];
}




export interface ILinkRPCDP {
    id?: number;
    rpId: number;
    amountCdpId: number;
    initialAmount?: number;
    isActive?: boolean;
    reasonCancellation?: string;
}

export interface IBudgetRecordFilter {
    consecutivoRpSap?:number;
    consecutiveRpAurora?:number;
    supplierType?:string;
    contractorDocument?:string;
    supplierName?:string;
    supplierId?:number;
    rpId?:number;
    reasonCancellation?:string;
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