
export interface IProjectOperation {
    id?: number;
    entityId: number;
    number: string;
    name: string;
    isActivated: string;
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