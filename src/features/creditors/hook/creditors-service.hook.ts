import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils";
import { ICreditor, ICreditorsFilter } from "../interface/creditor";

export const useCreditorsServices = () => {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/creditors"; 
    const { get, post } = useCrudService( baseURL);

    async function GetCreditorsByFilters(data: ICreditorsFilter): Promise<ApiResponse<ICreditor>> {
        const endpoint: string = "/get-creditors-by-filters"; 
        return post(`${roleUrl}${endpoint}`, data);
    }
    async function CreateCreditor(data: ICreditor): Promise<ApiResponse<ICreditor>> {
        const endpoint: string = "/create-creditor"; 
        return post(`${roleUrl}${endpoint}`, data);
    }
    async function UpdateCreditor(data: ICreditor): Promise<ApiResponse<ICreditor>> {
        const endpoint: string = "/update-creditor"; 
        return post(`${roleUrl}${endpoint}`, data);
    }

    
    return{
        GetCreditorsByFilters,
        CreateCreditor,
        UpdateCreditor
    }

}