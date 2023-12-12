import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";

export function usePaysServices() {
  const baseURL: string = process.env.urlApiFinancial;
  const roleUrl: string = "/api/v1/upload-masive";
  const roleUrlPagos: string = "/api/v1/pag-pagos";
  const { get, post } = useCrudService(baseURL);

  async function loadPays(data: any): Promise<ApiResponse<any>> {
    const endpoint: string = "/uploads";
    return post(`${roleUrl}${endpoint}`, data);
  }

  async function getPays(data: any): Promise<ApiResponse<any>> {
    const endpoint: string = "/get-paginated";
    return post(`${roleUrlPagos}${endpoint}`, data);
  }

  async function getAllFunds(data): Promise<ApiResponse<any>> {
    const endpoint: string = `/api/v1/funds/get-funds-by-number/`;
    return post(`${endpoint}`, data);
  }

  async function getPospreByParams(data): Promise<ApiResponse<any>> {
    const endpoint: string = `/api/v1/pospre-sapiencia/get-validate-masive/`;
    return post(`${endpoint}`, data);
  }

  async function getProjectDataApi(data): Promise<ApiResponse<any>> {
    const endpoint: string = `https://sapiencia-strategic-direction-api-ukyunq2uxa-uc.a.run.app/api/v1/project/get-by-filters`
    return post(`${endpoint}`, data);
  }

  async function getAllAF(): Promise<ApiResponse<any>> {
    const endpoint: string = `/api/v1/functional-area/get-all/`;
    return get(`${endpoint}`);
  }

  async function getAllProjects(): Promise<ApiResponse<any>> {
    const endpoint: string = `/api/v1/projects/get-all/`;
    return get(`${endpoint}`);
  }

  async function validateExitsRp(data: any): Promise<ApiResponse<any>> {
    const endpoint: string = "/validate-rp";
    return post(`${roleUrlPagos}${endpoint}`, data);
  }

  return {
    loadPays,
    getPays,
    validateExitsRp,
    getAllFunds,
    getAllAF,
    getAllProjects,
    getPospreByParams,
    getProjectDataApi,
  };
}
