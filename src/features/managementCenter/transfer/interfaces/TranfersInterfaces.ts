export interface ITransfers {
    id: number;
    actAdminDistrict: string;
    actAdminSapiencia: string;
    observations: string;
    transferMove: ITransferMove[];
}

export interface ITransferMove {
    id: number;
    type: string;
    value: string;
    budgetRouteId: number;
    transferId: number;
}