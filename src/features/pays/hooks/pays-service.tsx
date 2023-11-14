import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";


export function usePaysServices() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/upload-masive";
    const roleUrlA: string = "/api/v1/additions";
    const totalValuesUrl: string = "/api/v1/budget-records";   
    const { get, post, postFormData, put } = useCrudService( baseURL);


    async function loadPays(data: any): Promise<ApiResponse<any>> {
        const endpoint: string = "/uploads";
        return post(`${roleUrl}${endpoint}`, data);
    }

    return {
        loadPays,
      
     }
    };

