import useCrudService from "../../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../../common/utils/api-response";
import { ITypeTransfers } from "../interfaces/TypesTranfersInterfaces";

export function useProjectsInvesmentService() {
  const baseURL: string = process.env.urlApiFinancial;
  const roleUrl: string = "/api/v1/projects";
  const { get, post } = useCrudService(baseURL);

  async function GetProjectInvestmentPaginated(data:Object): Promise<ApiResponse<ITypeTransfers[]>> {
    const endpoint: string = "/get-unrelated-projects";
    return post(`${roleUrl}${endpoint}`, data);
  }

  return {
    GetProjectInvestmentPaginated
  };
}
