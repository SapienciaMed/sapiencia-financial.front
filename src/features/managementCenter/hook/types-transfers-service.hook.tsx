import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { ITypeTransfers } from "../interfaces/TypesTranfersInterfaces";

export function useTypesTranfersService() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/type-transfers";
    const { get } = useCrudService(null, baseURL);

    async function GetTypesTransfers(): Promise<ApiResponse<ITypeTransfers[]>> {
        const endpoint: string = "/get-all";
        return get(`${roleUrl}${endpoint}`);
    }

    return { GetTypesTransfers }
}