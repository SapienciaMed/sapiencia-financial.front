import useCrudService from "../../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../../common/utils/api-response";
import { IBudgets } from "../../interfaces/Budgets";


export function useBudgetsService() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/budgets";
    const roleUrlUpdate: string = "/api/v1/vinculation-mga"
    const { get, post, put } = useCrudService( baseURL);

    async function GetBudgets(id: number): Promise<ApiResponse<IBudgets>> {
        const endpoint: string = `/get-by-id/${id}`;
        return get(`${roleUrl}${endpoint}`);
    }

    async function CreateBudgets(data: IBudgets): Promise<ApiResponse<IBudgets>> {
        const endpoint: string = "/create";
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function UpdateBudgets(data: Object ): Promise<ApiResponse<IBudgets>> {
        const endpoint: string = `/update-vinculation-multiple`;
        return post(`${roleUrlUpdate}${endpoint}`, data);
    }

    async function getAllBudgets(): Promise<ApiResponse<IBudgets[]>> {
        const endpoint: string = `/get-all`;
        return get(`${roleUrl}${endpoint}`);
    }

    async function getAllCpc(): Promise<ApiResponse<IBudgets[]>> {
        const endpoint: string = `/get-all-cpc`;
        return get(`${roleUrl}${endpoint}`);
    }


    return { GetBudgets, CreateBudgets, UpdateBudgets, getAllBudgets,getAllCpc }
}