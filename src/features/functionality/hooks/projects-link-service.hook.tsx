import { useContext } from "react";
import { AppContext } from "../../../common/contexts/app.context";
import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IVinculationMGA } from "../interfaces/VinculationMGAInterfaces";
import { IProject, IProjectsVinculation } from "../interfaces/Projects";


export function useProjectsLinkService() {
    const baseURL: string = process.env.urlApiFinancial;
    const vinculationUrl: string = "/api/v1/functional-area";
    const { post, deleted } = useCrudService( baseURL);
    const { authorization } = useContext(AppContext);


    async function CreateVinculation(id:number, projects: IProject[]): Promise<ApiResponse<IVinculationMGA[]>> {
        const endpoint: string = "/link/create";
        const projectsLinks = projects.map(project => {
            return {
                id: project.id,
                type: project.type,
                linked: true
            }
        })
        const data = {
            idFunctionalArea : id,
            projects : projectsLinks,
            userCreate: authorization.user.numberDocument
        } 
        return post(`${vinculationUrl}${endpoint}`, data);
    }

    async function LinkVinculation(id:number , projects: number[]): Promise<ApiResponse<IProjectsVinculation[]>> {
        const endpoint: string = "/link/update";
        const projectsLinks = projects.map(project => {
            return {
                id: project,
                linked: true
            }
        })
        const data = {
            idFunctionalArea : id,
            projects : projectsLinks,
            userCreate: authorization.user.numberDocument
        } 
        return post(`${vinculationUrl}${endpoint}`, data);
    }

    async function UnLinkVinculation(id: number, projects: number[]): Promise<ApiResponse<IProjectsVinculation[]>> {
        const endpoint: string = "/link/update";
        const projectsLinks = projects.map(project => {
            return {
                id: project,
                linked: false
            }
        })
        const data = {
            idFunctionalArea : id,
            projects : projectsLinks,
            userCreate: authorization.user.numberDocument
        } 
        return post(`${vinculationUrl}${endpoint}`, data);
    }



    async function DeleteLinkVinculation(id: number): Promise<ApiResponse<boolean>>{
        const endpoint: string = `/link/delete/${id}`;
        return deleted(`${vinculationUrl}${endpoint}`);
    }


    return {  CreateVinculation, LinkVinculation, UnLinkVinculation, DeleteLinkVinculation }
}