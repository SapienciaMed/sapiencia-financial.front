import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils";
import { IPacComplementary, IPacFilters, IResultSearchDinamicPac } from "../interface/Pac";

export const usePacServices = () => {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/pac"; 
    const { get, post } = useCrudService( baseURL);

    async function GetRoutesByValidity(data: Object): Promise<ApiResponse<IPacComplementary>> {
        const endpoint: string = "/get-routes-by-validity"; 
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function GetUltimateVersion(): Promise<ApiResponse<any>> {
        const endpoint: string = "/get-ultimate-version"; 
        return get(`${roleUrl}${endpoint}`);
        
    }

    async function SearchPacs(data: IPacFilters):  Promise<ApiResponse<any>> {
        const endpoint: string = "/search-pacs"; 
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function GetPacById(id: number): Promise<ApiResponse<IResultSearchDinamicPac>> {
        const endpoint: string = `/get-pac-by-id/${id}`;
        return get(`${roleUrl}${endpoint}`);
    }

    return{
        GetRoutesByValidity,
        GetUltimateVersion,
        SearchPacs,
        GetPacById
    }

}