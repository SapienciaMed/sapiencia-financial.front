
export interface ICreditor {
    id?: number;
    typeDocument?: string;
    document?: string;
    taxIdentification?: string;
    name?: string;
    city?: string;
    address?: string;
    phone?: number;
    email?: string;
    userModify?: string;
    userCreate?: string;
    dateCreate?: string;
    dateModify?: string;

}


export interface ICreditorsFilter {
    id?: number;
    typeDocument?:string;
    document?:string;
    taxIdentification?:string;
    name?:string;
    page: number;
    perPage: number;
}