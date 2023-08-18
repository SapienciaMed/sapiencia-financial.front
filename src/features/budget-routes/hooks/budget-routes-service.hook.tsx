import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IBudgetsRoutes } from "../interfaces/BudgetRoutesInterfaces";


export function useBudgetRoutesService() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/budget-routes";
    const { get, post, put } = useCrudService(null, baseURL);

    async function GetBudgetRoutes(id: number): Promise<ApiResponse<IBudgetsRoutes>> {
        const endpoint: string = `/get-by-id/${id}`;
        return get(`${roleUrl}${endpoint}`);
    }

    async function CreateBudgetRoutes(data: IBudgetsRoutes): Promise<ApiResponse<IBudgetsRoutes>> {
        const endpoint: string = "/create";
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function UpdateBudgetRoutes(
        id: number,
        data: IBudgetsRoutes
    ): Promise<ApiResponse<IBudgetsRoutes>> {
        const endpoint: string = `/update/${id}`;
        return put(`${roleUrl}${endpoint}`, data);
    }

    return { GetBudgetRoutes, CreateBudgetRoutes, UpdateBudgetRoutes }
}