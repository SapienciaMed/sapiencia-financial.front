import { useContext } from "react";
import { AppContext } from "../../../common/contexts/app.context";
import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IDataActivityMGA, IVinculationMGA } from "../interfaces/VinculationMGAInterfaces";


export function useVinculationService() {
    const baseURL: string = process.env.urlApiFinancial;
    const vinculationUrl: string = "/api/v1/vinculation-mga";
    const { post  } = useCrudService( baseURL);
    const { authorization } = useContext(AppContext);


    async function CreateVinculation(data: any): Promise<ApiResponse<IVinculationMGA[]>> {
        const endpoint: string = "/create-vinculation-api-planning";
        return post(`${vinculationUrl}${endpoint}`, data);
    }

    return {  CreateVinculation }
}