import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IEntities } from "../interfaces/Entities";

export function useEntitiesService() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/entities";
    const { get } = useCrudService( baseURL);

    async function GetEntities(): Promise<ApiResponse<IEntities[]>> {
        const endpoint: string = "/get-all";
        return get(`${roleUrl}${endpoint}`);
    }

    return { GetEntities }
}