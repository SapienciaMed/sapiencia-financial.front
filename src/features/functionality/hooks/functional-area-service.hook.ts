import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IFunctionalArea } from "../interfaces/Functional-Area";

export function useFunctionalAreaService() {
    const baseURL: string = process.env.urlApiFinancial;
    const vinculationUrl: string = "/api/v1/functional-area";
    const { get } = useCrudService(null, baseURL);

    async function GetFunctionalArea(id: number): Promise<ApiResponse<IFunctionalArea>> {
        const endpoint: string = `/get-by-id/${id}`;
        return get(`${vinculationUrl}${endpoint}`);
    }

    return { GetFunctionalArea };
}