import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IBudgetAvalaibility } from "../interfaces/budgetAvailabilityInterfaces";
import { ITotalRP } from "../interfaces/totalRPInterface";

export function useCdpService() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/cdp";
    const roleUrlA: string = "/api/v1/additions";
    const totalValuesUrl: string = "/api/v1/budget-records";   
    const getActivities: string = "/api/v1/vinculation-mga"
    const { get, post, postFormData, put } = useCrudService( baseURL);

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

    async function updateRouteCdp(id:number,data: Object): Promise<ApiResponse<any[]>> {
        const endpoint: string = "/updateRouteCDP/"+id;
        return put(`${roleUrl}${endpoint}`, data);
    }

    async function getTotalValuesImport(id:number): Promise<ApiResponse<ITotalRP>> {
        const endpoint: string = "/get-totalvaluesimports/"+id;
        return get(`${totalValuesUrl}${endpoint}`);
    }

    async function associateCdpAmounts(data: Object): Promise<ApiResponse<any[]>> {
        const endpoint: string = "/asociate-amounts";
        return postFormData(`${roleUrl}${endpoint}`, data);
    }
    
    //get Rps asociados
    async function getRpsCDPId(id:number): Promise<ApiResponse<IBudgetAvalaibility>> {
        const endpoint: string = "/get-CDPRp-id/"+id;
        return get(`${roleUrl}${endpoint}`);
    }

    async function getActivitiesDetail(): Promise<ApiResponse<any>> {
        const endpoint: string = "/get-activities-detail";
        return post(`${getActivities}${endpoint}`);
    }

    async function validate(data:object): Promise<ApiResponse<any>> {
        const endpoint: string = "/validate";
        return post(`${getActivities}${endpoint}`,data);
    }
    async function validateCDP(data:object): Promise<ApiResponse<any>> {
        const endpoint: string = "/validate-all-Cdp";
        return post(`${getActivities}${endpoint}`,data);
    }

    async function createVinculationMGA(data:object): Promise<ApiResponse<any>> {
        const endpoint: string = "/create-vinculation-mga";
        return post(`${getActivities}${endpoint}`,data);
    }
   

    async function getDetaileActivities(data:any): Promise<ApiResponse<any>> {
        const endpoint: string = `/get-detailed-activities-api-planning-yesuseonpospre/${data}`;
        return post(`${getActivities}${endpoint}`);
    }

    return {
        createCdp,
        createCdp_,
        getCdpById,
        getOneRpp,
        cancelAmount,
        getRouteCDPId,
        updateRouteCdp,
        associateCdpAmounts,
        getTotalValuesImport,       
        getRpsCDPId,
        getActivitiesDetail,
        validate,
        validateCDP,
        createVinculationMGA,
        getDetaileActivities
     }
    };

