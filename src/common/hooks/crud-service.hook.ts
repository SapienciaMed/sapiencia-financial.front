import instanceApi from "../utils/api-instance";
import { ApiResponse } from "../utils/api-response";

function useCrudService<T>(token: string | null, baseUrl: string) {
  const api = instanceApi(token, baseUrl);

  const get = async <T>(endpoint: string, params: Object = {}) => {
    const options = {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      url: `${endpoint}`,
      params: params,
    };
    return (await api(options)) as ApiResponse<T>;
  };

  const post = async <T>(
    endpoint: string,
    data: Object = {},
    params: Object = {}
  ) => {
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      url: `${endpoint}`,
      params: params,
      data: data,
    };
    return (await api(options)) as ApiResponse<T>;
  };

  const put = async <T>(
    endpoint: string,
    data: Object = {},
    params: Object = {}
  ) => {
    const options = {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      url: `${endpoint}`,
      params: params,
      data: data,
    };
    return (await api(options)) as ApiResponse<T>;
  };

  const deleted = async <T>(endpoint: string, params: Object = {}) => {
    const options = {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      url: `${endpoint}`,
      params: params,
    };
    return (await api(options)) as ApiResponse<T>;
  };

  return { post, get, put, deleted };
}

export default useCrudService;
