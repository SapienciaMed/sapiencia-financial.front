import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IFunds } from "../interfaces/Funds";

export function useFundsService() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/funds";
    const { get, post, put } = useCrudService(null, baseURL);

    async function GetFund(id: number): Promise<ApiResponse<IFunds>> {
        const endpoint: string = `/get-by-id/${id}`;
        return get(`${roleUrl}${endpoint}`);
    }

    async function CreateFund(data: IFunds): Promise<ApiResponse<IFunds>> {
        const endpoint: string = "/create";
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function UpdateFund(
        id: number,
        data: Object
    ): Promise<ApiResponse<IFunds>> {
        const endpoint: string = `/update/${id}`;
        return put(`${roleUrl}${endpoint}`, data);
    }

    return { GetFund, CreateFund, UpdateFund }
}