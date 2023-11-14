import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils";
import { ICautation } from "../interface/Cautation";
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
    
    async function GetRpByFilters(data: Object): Promise<ApiResponse<IBudgetRecord[]>> {
        const endpoint: string = `/get-rp-by-filters`;
        return post(`${roleUrl}${endpoint}`, data);
    }
    
    async function CancelLinkCdp(id:string,data: Object): Promise<ApiResponse<any>> {
        const endpoint: string = `/update-data/${id}`;
        return post(`${roleUrl}${endpoint}`, data);
    }
    
    async function UpdateDataBasicRp(data: Object): Promise<ApiResponse<any>> {
        const endpoint: string = `/update-data-basic-rp`;
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function GetCausation(id:number): Promise<ApiResponse<ICautation>> {
        const endpoint: string = `/get-causation/${id}`;
        return get(`${roleUrl}${endpoint}`);
    }

    return{
        CreateBudgetRecord,
        GetAllComponents,
        GetRpByFilters,
        CancelLinkCdp,
        UpdateDataBasicRp,
        GetCausation
    }

}