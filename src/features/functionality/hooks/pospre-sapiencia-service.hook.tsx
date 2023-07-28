import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IPosPreSapiencia } from "../interfaces/PosPreSapiencia";

export function usePosPreSapienciaService() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/pospre-sapiencia";
    const { get, post, put } = useCrudService(null, baseURL);

    async function GetPosPreSapiencia(id: number): Promise<ApiResponse<IPosPreSapiencia>> {
        const endpoint: string = `/get-by-id/${id}`;
        return get(`${roleUrl}${endpoint}`);
    }

    async function CreatePosPreSapiencia(data: IPosPreSapiencia): Promise<ApiResponse<IPosPreSapiencia>> {
        const endpoint: string = "/create";
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function UpdatePosPreSapiencia(
        id: number,
        data: Object
    ): Promise<ApiResponse<IPosPreSapiencia>> {
        const endpoint: string = `/update/${id}`;
        return put(`${roleUrl}${endpoint}`, data);
    }

    return { GetPosPreSapiencia, CreatePosPreSapiencia, UpdatePosPreSapiencia }
}