import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse, IPagingData } from "../../../common/utils/api-response";
import { IFunds } from "../interfaces/Funds";

export function useFundsService() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/funds";
    const { get, post, put, deleted } = useCrudService(null, baseURL);

    return { }
}