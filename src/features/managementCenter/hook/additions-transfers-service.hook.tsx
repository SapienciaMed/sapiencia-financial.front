
import useCrudService from '../../../common/hooks/crud-service.hook';
import { ApiResponse, IPagingData } from '../../../common/utils/api-response';
import { IData } from "../interfaces/Additions";
import { IAdditionsTransfersDistrictInterfaces, IAdditionsTransfersSapienciaInterfaces, IFundsAdditionList, IPosPreAddition, IPosPreSapienciaAdditionList, IProjectAdditionList } from '../../functionality/interfaces/AdditionsTransfersInterfaces';
export const useAdditionsTransfersService = () => {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/additions";
    const { get, post } = useCrudService( baseURL);

    async function GetAllAdditionsByDistrict(): Promise<ApiResponse<IAdditionsTransfersDistrictInterfaces[]>> {
        const endpoint: string = "/get-actadmin-district";
        return get(`${roleUrl}${endpoint}`);
    }

    async function GetAllAdditionsBySapiencia(): Promise<ApiResponse<IAdditionsTransfersSapienciaInterfaces[]>> {
        const endpoint: string = "/get-actadmin-sapiencia";
        return get(`${roleUrl}${endpoint}`);
    }

    async function GetProjectsList(): Promise<ApiResponse<IProjectAdditionList[]>> {
        return get(`/api/v1/projects/get-all`);
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
    
    async function validateCreateAdition(data: Object): Promise<ApiResponse<IPagingData<IPosPreSapienciaAdditionList>>> {
        const endpoint: string = "/create";
        return post(`${roleUrl}${endpoint}`,data);
    }
    
    async function createAdition(data: Object): Promise<ApiResponse<IPagingData<IPosPreSapienciaAdditionList>>> {
        const endpoint: string = "/save-data";
        return post(`${roleUrl}${endpoint}`,data);
    }
    
    async function showAdition(id: string): Promise<ApiResponse<IData>> {
        const endpoint: string = `/get-by-id/${id}`;
        return get(`${roleUrl}${endpoint}`);
    }    

    async function validateEditAdition(id:string,data: Object): Promise<ApiResponse<IPagingData<IPosPreSapienciaAdditionList>>> {
        const endpoint: string = `/update/${id}`;
        return post(`${roleUrl}${endpoint}`,data);
    }
    
    async function editAdition(id:string,data: Object): Promise<ApiResponse<IPagingData<IPosPreSapienciaAdditionList>>> {
        const endpoint: string = `/update-save/${id}`;
        return post(`${roleUrl}${endpoint}`,data);
    }

    return { GetAllAdditionsByDistrict, GetAllAdditionsBySapiencia, GetProjectsList, GetFundsList, GetPosPreList, GetPosPreSapienciaList, validateCreateAdition, createAdition,showAdition,validateEditAdition,editAdition }
}
