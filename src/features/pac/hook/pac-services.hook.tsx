import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils";
import { IEditPac, IPacComplementary, IPacFilters, IResultSearchDinamicPac, IViewPacComplete } from "../interface/Pac";

export const usePacServices = () => {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/pac"; 
    const { get, post } = useCrudService( baseURL);

    async function GetRoutesByValidity(data: Object): Promise<ApiResponse<IPacComplementary>> {
        const endpoint: string = "/get-routes-by-validity"; 
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function GetUltimateVersion(exercise: object): Promise<ApiResponse<any>> {
        const endpoint: string = `/get-ultimate-version/`; 
        return post(`${roleUrl}${endpoint}`, exercise);  
    }

    async function SearchPacs(data: IPacFilters):  Promise<ApiResponse<any>> {
        const endpoint: string = "/search-pacs"; 
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function GetPacById(id: number): Promise<ApiResponse<IResultSearchDinamicPac>> {
        const endpoint: string = `/get-pac-by-id/${id}`;
        return get(`${roleUrl}${endpoint}`);
    }

    async function EditPac(data: IEditPac): Promise<ApiResponse<any>> {
        const endpoint: string = `/edit-pac`;
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function ViewPacComplete(data: IEditPac): Promise<ApiResponse<IViewPacComplete>> {
        const endpoint: string = `/get-view-pac`;
        return post(`${roleUrl}${endpoint}`, data);
    }

    return{
        GetRoutesByValidity,
        GetUltimateVersion,
        SearchPacs,
        GetPacById,
        EditPac,
        ViewPacComplete
    }

}