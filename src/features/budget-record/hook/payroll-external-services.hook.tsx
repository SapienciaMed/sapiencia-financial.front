import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils";

export const usePayrollExternalServices = () => {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/payroll"; 
    const { get, post } = useCrudService( baseURL);

    async function GetContractorsByDocuments(data: Object): Promise<ApiResponse<any>> {
        const endpoint: string = "/get-contractors-by-documents"; 
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function GetAllDependencies(): Promise<ApiResponse<{id:number, name:string}[]>> {
        const endpoint: string = `/get-all-dependencies`;
        return get(`${roleUrl}${endpoint}`);
    }

    return{
        GetAllDependencies,
        GetContractorsByDocuments
    }

}