import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";


export function usePaysServices() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/upload-masive";
    const roleUrlPagos: string = "/api/v1/pag-pagos";
    const roleUrlA: string = "/api/v1/additions";
    const totalValuesUrl: string = "/api/v1/budget-records";   
    const { get, post, postFormData, put } = useCrudService( baseURL);


    async function loadPays(data: any): Promise<ApiResponse<any>> {
        const endpoint: string = "/uploads";
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function getPays(data: any): Promise<ApiResponse<any>> {
        const endpoint: string = "/get-paginated";
        return post(`${roleUrlPagos}${endpoint}`, data);
    }

    async function getAllFunds(): Promise<ApiResponse<any>> {
        const endpoint: string = `/api/v1/funds/get-all/`;
        return get(`${endpoint}`);
    }

    async function validateExitsRp(data: any): Promise<ApiResponse<any>> {
        const endpoint: string = "/validate-rp";
        return post(`${roleUrlPagos}${endpoint}`, data);
    }

    return {
        loadPays,
        getPays,
        validateExitsRp,
        getAllFunds
     }
    };

