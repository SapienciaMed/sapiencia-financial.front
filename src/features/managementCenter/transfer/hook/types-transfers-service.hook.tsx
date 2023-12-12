import useCrudService from "../../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../../common/utils/api-response";
import { ITypeTransfers } from "../interfaces/TypesTranfersInterfaces";

export function useTypesTranfersService() {
  const baseURL: string = process.env.urlApiFinancial;
  const roleUrl: string = "/api/v1/transfers";
  const { get, post } = useCrudService(baseURL);

  async function GetTypesTransfers(): Promise<ApiResponse<ITypeTransfers[]>> {
    const endpoint: string = "/get-all";
    return get(`${roleUrl}${endpoint}`);
  }

  async function GetTransfers(): Promise<ApiResponse<ITypeTransfers[]>> {
    const endpoint: string = "/get-paginated";
    return get(`${roleUrl}${endpoint}`);
  }

  async function validateCreateTransfer(
    data: Object
  ): Promise<ApiResponse<any[]>> {
    const endpoint: string = "/create";
    return post(`${roleUrl}${endpoint}`, data);
  }

  async function createTransfer(data: Object): Promise<ApiResponse<any[]>> {
    const endpoint: string = "/save-data";
    return post(`${roleUrl}${endpoint}`, data);
  }

  async function getTransferById(id: string): Promise<ApiResponse<any>> {
    const endpoint: string = `/get-by-id/${id}`;
    return get(`${roleUrl}${endpoint}`);
  }

  return {
    GetTypesTransfers,
    GetTransfers,
    validateCreateTransfer,
    createTransfer,
    getTransferById,
  };
}
