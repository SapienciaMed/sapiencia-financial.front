import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IFunctionalArea } from "../interfaces/Functional-Area";
import { IProject } from "../interfaces/Projects";

export function useFunctionalAreaService() {
    const baseURL: string = process.env.urlApiFinancial;
    const vinculationUrl: string = "/api/v1/functional-area";
    const projectsUrl: string = "/api/v1/projects";
    const { get, post, put } = useCrudService( baseURL);

    async function GetFunctionalArea(id: number): Promise<ApiResponse<IFunctionalArea>> {
        const endpoint: string = `/get-by-id/${id}`;
        return get(`${vinculationUrl}${endpoint}`);
    }

    async function CreateFunctionalArea(data: IFunctionalArea):Promise<ApiResponse<IFunctionalArea>> {
        const endpoint: string = `/create`;
        return post(`${vinculationUrl}${endpoint}`, data);
    }

    async function getAllProjects():Promise<ApiResponse<IProject[]>> {
        const endpoint: string = `/get-all`;
        return get(`${projectsUrl}${endpoint}`);
    }

    async function UpdateFunctionalArea(data: IFunctionalArea, id: number):Promise<ApiResponse<IFunctionalArea>>{
        const endpoint: string = `/update/${id}`;
        return put(`${vinculationUrl}${endpoint}`, data);
    }
    
    async function GetAllFunctionalAreas(): Promise<ApiResponse<IFunctionalArea[]>> {
        const endpoint: string = `/get-all`;
        return get(`${vinculationUrl}${endpoint}`);
    }

    return { GetFunctionalArea, CreateFunctionalArea, getAllProjects, UpdateFunctionalArea, GetAllFunctionalAreas };
}