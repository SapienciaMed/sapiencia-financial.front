
import useCrudService from '../../../common/hooks/crud-service.hook';
import { ApiResponse, IPagingData } from '../../../common/utils/api-response';
import { IAdditionsTransfersDistrictInterfaces, IAdditionsTransfersSapienciaInterfaces, IFundsAdditionList, IProjectAdditionList, IPosPreAddition, IPosPreSapienciaAdditionList } from '../interfaces/AdditionsTransfersInterfaces';

export const useAdditionsTransfersService = () => {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/additions";
    const { get, post } = useCrudService(null, baseURL);

    async function GetAllAdditionsByDistrict(): Promise<ApiResponse<IAdditionsTransfersDistrictInterfaces[]>> {
        const endpoint: string = "/get-actadmin-district";
        return get(`${roleUrl}${endpoint}`);
    }

    async function GetAllAdditionsBySapiencia(): Promise<ApiResponse<IAdditionsTransfersSapienciaInterfaces[]>> {
        const endpoint: string = "/get-actadmin-sapiencia";
        return get(`${roleUrl}${endpoint}`);
    }

    async function GetProjectsList(data: Object): Promise<ApiResponse<IPagingData<IProjectAdditionList>>> {
        const endpoint: string = "/get-projects";
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function GetFundsList(data: Object): Promise<ApiResponse<IPagingData<IFundsAdditionList>>> {
        const endpoint: string = "/get-funds";
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function GetPosPreList(): Promise<ApiResponse<IPagingData<IPosPreAddition | string[]>>>  {
        const endpoint: string = "/get-pospre";
        return post(`${roleUrl}${endpoint}`);
    }

    async function GetPosPreSapienciaList(): Promise<ApiResponse<IPagingData<IPosPreSapienciaAdditionList>>> {
        const endpoint: string = "/get-pospre-sapiencia";
        return post(`${roleUrl}${endpoint}`);
    }

    return { GetAllAdditionsByDistrict, GetAllAdditionsBySapiencia, GetProjectsList, GetFundsList, GetPosPreList, GetPosPreSapienciaList }
}
