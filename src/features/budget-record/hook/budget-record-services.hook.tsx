import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils";
import { IBudgetRecord } from "../interface/budget-record";

export const useBudgetRecordServices = () => {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/budget-records"; 
    const { get, post } = useCrudService( baseURL);

    async function CreateBudgetRecord(data: Object): Promise<ApiResponse<IBudgetRecord>> {
        const endpoint: string = "/create-rp"; 
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function GetAllComponents(): Promise<ApiResponse<{id:number, name:string}[]>> {
        const endpoint: string = `/get-components`;
        return get(`${roleUrl}${endpoint}`);
    }

    return{
        CreateBudgetRecord,
        GetAllComponents
    }

}