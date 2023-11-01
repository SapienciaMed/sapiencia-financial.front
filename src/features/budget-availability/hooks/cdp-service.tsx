import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IBudgetAvalaibility } from "../interfaces/budgetAvailabilityInterfaces";

export function useCdpService() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/cdp";
    const roleUrlA: string = "/api/v1/additions";
    const { get, post, postFormData } = useCrudService( baseURL);

    async function getCdpById(id:string): Promise<ApiResponse<IBudgetAvalaibility>> {
        const endpoint: string = "/get-by-id/"+id;
        return get(`${roleUrl}${endpoint}`);
    }
    
    async function createCdp(data: Object): Promise<ApiResponse<any[]>> {
        const endpoint: string = "/upload-pac";
        return postFormData(`${roleUrl}${endpoint}`, data);
    }
  
    async function getOneRpp(data: Object): Promise<ApiResponse<any[]>> {
        const endpoint: string = "/get-info-filter";
        return postFormData(`${roleUrlA}${endpoint}`, data);
    }

    async function createCdp_(data: any): Promise<ApiResponse<any>> {
        const endpoint: string = "/create-cdp";
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function cancelAmount(data: Object): Promise<ApiResponse<any[]>> {
        const endpoint: string = "/cancel-amount";
        return postFormData(`${roleUrl}${endpoint}`,data);
    }
    
    async function getRouteCDPId(id:number): Promise<ApiResponse<IBudgetAvalaibility>> {
        const endpoint: string = "/get-routeCDP-id/"+id;
        return get(`${roleUrl}${endpoint}`);
    }

    return {
        createCdp,
        createCdp_,
        getCdpById,
        getOneRpp,
        cancelAmount,
        getRouteCDPId
     }
    };

