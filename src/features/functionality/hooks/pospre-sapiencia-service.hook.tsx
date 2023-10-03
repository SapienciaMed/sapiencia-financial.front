import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse, IPagingData } from "../../../common/utils/api-response";
import { IPosPreSapiencia } from "../interfaces/PosPreSapiencia";

export function usePosPreSapienciaService() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/pospre-sapiencia";
    const { get, post, put } = useCrudService( baseURL);

    async function GetPosPreSapiencia(data: any): Promise<ApiResponse<IPagingData<IPosPreSapiencia>>> {
        const endpoint: string = `/get-list-pospresap-vinculation-paginated`;
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function CreatePosPreSapiencia(data: IPosPreSapiencia): Promise<ApiResponse<IPosPreSapiencia>> {
        const endpoint: string = "/create-pospresap-vinculation";
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function UpdatePosPreSapiencia(id: number, data: Object): Promise<ApiResponse<IPosPreSapiencia>> {
        const endpoint: string = `/update-pospresap-vinculation/${id}`;
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function GetAllPosPreSapiencia(): Promise<ApiResponse<IPosPreSapiencia[]>> {
        const endpoint: string = `/get-all`;
        return get(`${roleUrl}${endpoint}`);
    }

    return { GetPosPreSapiencia, CreatePosPreSapiencia, UpdatePosPreSapiencia, GetAllPosPreSapiencia }
}