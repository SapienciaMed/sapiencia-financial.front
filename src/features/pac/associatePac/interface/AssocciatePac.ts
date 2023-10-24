import { IAddFund } from "../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface";


export interface IAssocciatePac{
    sapienciaBudget: number;
    totalProgrammed: number;
    exercise: string,
    resourceType: string,
    managerCenter: string;
    projectId: string;
    projectName?: string;
    functionalArea: string;
    pospreSapiencia?: string;
    funds?: string;
    fundsSapiencia?: string;
    posPre?: string;
    typeTransfer?:string;
    programmed: {
        [key: string]: string;
    };
}
