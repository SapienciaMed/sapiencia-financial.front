

export interface IBudgetRecord {
    id?: number;
    supplierType: string;
    supplierId: number;
    contractorDocument: string;
    documentDate: any;
    dateValidity: any;
    dependencyId: number;
    contractualObject: string;
    componentId: number;
    userCreate?: string;
    userModify?: string;
    dateCreate?: Date;
    dateModify?: string;
    linksRp?: ILinkRPCDP[]
}


export interface ILinkRPCDP {
    id?: number;
    rpId: number;
    amountCdpId: number;
    initialAmount?: number;
    isActive?: boolean;
    reasonCancellation?: string;
}