import useCrudService from "../../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../../common/utils/api-response";
import { IPac } from "../../interface/Pac";

export function usePacService() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/projectOperation";
    const { get, post } = useCrudService( baseURL);

    async function GetTypesTransfers(): Promise<ApiResponse<IPac[]>> {
        const endpoint: string = "/get-all";
        return get(`${roleUrl}${endpoint}`);
    }
    
    async function GetTransfers(): Promise<ApiResponse<IPac[]>> {
        const endpoint: string = "/get-paginated";
        return get(`${roleUrl}${endpoint}`);
    }

    async function createProjectOperation(data: Object): Promise<ApiResponse<any[]>> {
        const endpoint: string = "/create";
        return post(`${roleUrl}${endpoint}`,data);
    }
    
    async function GetProjectOperation(id: number): Promise<ApiResponse<any>> {
        const endpoint: string = `/get-by-id/${id}`;
        return get(`${roleUrl}${endpoint}`);
    }
    
    async function UpdateProjectOperation(id: number,data: Object): Promise<ApiResponse<any[]>> {
        const endpoint: string = `/update-save/${id}`;
        return post(`${roleUrl}${endpoint}`,data);
    }

    return { 
        GetTypesTransfers,
        GetTransfers,
        createProjectOperation,
        GetProjectOperation,
        UpdateProjectOperation
     }
}