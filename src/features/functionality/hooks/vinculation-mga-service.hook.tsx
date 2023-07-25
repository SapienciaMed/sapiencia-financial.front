import { useContext } from "react";
import { AppContext } from "../../../common/contexts/app.context";
import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IVinculationMGA } from "../interfaces/VinculationMGAInterfaces";


export function useVinculationService() {
    const baseURL: string = process.env.urlApiFinancial;
    const vinculationUrl: string = "/api/v1/vinculation-mga";
    const { post, deleted } = useCrudService(null, baseURL);
    const { authorization } = useContext(AppContext);


    async function CreateVinculation(id:number, activities: number[]): Promise<ApiResponse<IVinculationMGA[]>> {
        const endpoint: string = "/create";
        const data = {
            budgetId : id,
            activities : activities,
            userCreate: authorization.user.numberDocument
        } 
        return post(`${vinculationUrl}${endpoint}`, data);
    }

    async function DeleteVinculation(id:number , activities: number[]): Promise<ApiResponse<boolean>> {
        const endpoint: string = "/delete";
        const data = {
            budgetId : id,
            activities : activities,
            userCreate: authorization.user.numberDocument
        } 
        return post(`${vinculationUrl}${endpoint}`, data);
    }




    return {  CreateVinculation ,DeleteVinculation }
}