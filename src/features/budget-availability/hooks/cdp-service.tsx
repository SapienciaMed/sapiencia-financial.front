import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";

export function usePacService() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/cdp";
    const { get, post, postFormData } = useCrudService(baseURL);

    async function createCdp(data: Object): Promise<ApiResponse<any[]>> {
        const endpoint: string = "/upload-pac";
        return postFormData(`${roleUrl}${endpoint}`, data);
    }

    async function createCdp_(data: any): Promise<ApiResponse<any>> {
        const endpoint: string = "/create-cdp";
        return post(`${roleUrl}${endpoint}`, data);
    }

    return {
        createCdp,
        createCdp_,
    };
}
