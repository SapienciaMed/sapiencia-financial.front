import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IProjectOperation } from "../interface/ProjectOperation";

export function useProjectOperationService() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/projectOperation";
    const { get, post } = useCrudService( baseURL);

    async function GetTypesTransfers(): Promise<ApiResponse<IProjectOperation[]>> {
        const endpoint: string = "/get-all";
        return get(`${roleUrl}${endpoint}`);
    }
    
    async function GetTransfers(): Promise<ApiResponse<IProjectOperation[]>> {
        const endpoint: string = "/get-paginated";
        return get(`${roleUrl}${endpoint}`);
    }

    async function createProjectOperation(data: Object): Promise<ApiResponse<any[]>> {
        const endpoint: string = "/create";
        return post(`${roleUrl}${endpoint}`,data);
    }

    return { 
        GetTypesTransfers,
        GetTransfers,
        createProjectOperation
     }
}