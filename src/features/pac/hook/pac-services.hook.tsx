import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils";

export const usePacServices = () => {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/pac"; 
    const { get, post } = useCrudService( baseURL);

    async function GetRoutesByValidity(data: Object): Promise<ApiResponse<any>> {
        const endpoint: string = "/get-routes-by-validity"; 
        return post(`${roleUrl}${endpoint}`, data);
    }

    return{
        GetRoutesByValidity
    }

}