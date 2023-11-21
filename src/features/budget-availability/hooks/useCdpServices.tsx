import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils";

export const useCdpServices = () => {
  const baseURL: string = process.env.urlApiFinancial;
  const roleUrl: string = "/api/v1/cdp";
  const { post } = useCrudService(baseURL);
  async function GetRoutesByValidity(data: Object): Promise<ApiResponse<any>> {
    try {
      const endpoint: string = "/search-cdps";
      return post(`${roleUrl}${endpoint}`, data);
    } catch (error) {
      console.log({ GetRoutesByValidity: error });
    }
  }

  const updateDataBasicCdp = async (data, id) => {
    try {
      const endpoint: string = `/edit-cdp/${id}`;
      return post(`${roleUrl}${endpoint}`, data);
    } catch (error) {
      console.log({ updateDataBasicCdp: error });
    }
  };
  return { GetRoutesByValidity, updateDataBasicCdp };
};
