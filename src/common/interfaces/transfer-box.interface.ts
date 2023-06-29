export interface ITransferBoxTemplate {
    key: string;
    label: string;
    children: ITransferBoxChildren[] | null;
    id?: number;
}

export interface ITransferBoxChildren {
    key: string;
    label: string;
    id?: number;
    parentId?: number;
}