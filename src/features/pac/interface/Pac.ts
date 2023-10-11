
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


export interface IHeadPac {
    exercise:number;
    typePac:string;
    typeSource:string;
    file:any;


}