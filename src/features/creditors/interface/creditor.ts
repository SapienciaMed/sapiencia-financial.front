
export interface ICreditor {
    id: number | null;
    typeDocument: string;
    document: string;
    taxIdentification: string;
    name: string;
    city: string;
    address: string;
    phone: number | null;
    email: string;
    userModify?: string;
    userCreate?: string;
    dateCreate?: string;
    dateModify?: string;

}


export interface ICreditorsFilter {
    id: number | null;
    document?: string;
    page: number;
    perPage: number;
}