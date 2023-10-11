import useCrudService from "../../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../../common/utils/api-response";
import { IPac } from "../../interface/Pac";

export function usePacService() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/pac";
    const { get, post, postFormData } = useCrudService( baseURL);

    /* async function GetTypesTransfers(): Promise<ApiResponse<IPac[]>> {
        const endpoint: string = "/get-all";
        return get(`${roleUrl}${endpoint}`);
    } */
    
    async function uploadPac(data: Object): Promise<ApiResponse<any[]>> {
        const endpoint: string = "/upload-pac";
        return postFormData(`${roleUrl}${endpoint}`,data);
    }
    
    return { 
        uploadPac
     }
}