import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IFunds } from "../../functionality/interfaces/Funds";
import { IPosPreSapiencia } from "../../functionality/interfaces/PosPreSapiencia";
import { IBudgetsRoutes } from "../interfaces/BudgetRoutesInterfaces";

export function useBudgetRoutesService() {
  const baseURL: string = process.env.urlApiFinancial;
  const roleUrl: string = "/api/v1/budget-routes";
  const { get, post, put } = useCrudService(baseURL);

  async function GetBudgetRoutes(
    id: number
  ): Promise<ApiResponse<IBudgetsRoutes>> {
    const endpoint: string = `/get-by-id/${id}`;
    return get(`${roleUrl}${endpoint}`);
  }

  async function CreateBudgetRoutes(
    data: IBudgetsRoutes
  ): Promise<ApiResponse<IBudgetsRoutes>> {
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

  // filtra en modelo de datos de ruta presupuestal.
  async function GetFundsByProjectId(
    id: number
  ): Promise<ApiResponse<IFunds[]>> {
    const endpoint: string = `/get-funds-by-project/${id}`;
    return get(`${roleUrl}${endpoint}`);
  }

  // filtra en modelo de datos de ruta presupuestal.
  async function GetPospreByProjectAndFundId(
    projectId: number,
    fundId: number
  ): Promise<ApiResponse<IPosPreSapiencia[]>> {
    const endpoint: string = `/get-pospre-by-project/${projectId}/fund/${fundId}`;
    return get(`${roleUrl}${endpoint}`);
  }

  return {
    GetBudgetRoutes,
    CreateBudgetRoutes,
    UpdateBudgetRoutes,
    GetFundsByProjectId,
    GetPospreByProjectAndFundId,
  };
}
