import useCrudService from "../../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../../common/utils";
import { ICreateAssociation, IPacComplementary } from "../../interface/Pac";

export const useAssociatePacService = () => {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/pac"; 
    const { get, post } = useCrudService( baseURL);

    async function listDinamicsAssociations(data: Object): Promise<ApiResponse<IPacComplementary>> {
        const endpoint: string = "/lists-dinamics-association"; 
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function CreateAssociations(data: ICreateAssociation): Promise<ApiResponse<any>>  {
        const endpoint: string = "/create-association"; 
        return post(`${roleUrl}${endpoint}`, data);
    }

    return{
        listDinamicsAssociations,
        CreateAssociations
    }
}