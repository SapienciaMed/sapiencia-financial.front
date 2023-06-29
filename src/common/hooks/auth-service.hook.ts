import { EResponseCodes } from "../constants/api.enum";
import { IAuthorization } from "../interfaces/auth.interfaces";
import { ApiResponse } from "../utils/api-response";
import useCrudService from "./crud-service.hook";

export function useAuthService() {
  const baseURL: string = "http://localhost:4201";
  const authUrl: string = "/api/v1/auth";

  const { get, post } = useCrudService(null, baseURL);

  async function getAuthorization(
    token: string
  ): Promise<ApiResponse<IAuthorization>> {
    try {
      const endpoint: string = `/authorization/get-by-token/${token}`;
      return await get(`${authUrl}${endpoint}`);
    } catch (error) {
      return new ApiResponse(
        {} as IAuthorization,
        EResponseCodes.FAIL,
        "Error no controlado"
      );
    }
  }

  return {
    getAuthorization,
  };
}

export default useAuthService;
