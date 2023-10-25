import { IAddFund } from "../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface";


export interface IAssocciatePac{
    sapienciaBudget: string;
    totalProgrammed: string;
    exercise: string,
    resourceType: string,
    managerCenter: string;
    projectId: string;
    projectName?: string;
    functionalArea: string | number;
    pospreSapiencia?: string;
    funds?: string;
    fundsSapiencia?: string;
    posPre?: string;
    typeTransfer?:string;
    programmed: {
        [key: string]: string;
    };
}
