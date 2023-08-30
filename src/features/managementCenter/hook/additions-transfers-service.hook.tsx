
import useCrudService from '../../../common/hooks/crud-service.hook';
import { ApiResponse } from '../../../common/utils/api-response';
import { IAdditionsTransfersDistrictInterfaces, IAdditionsTransfersSapienciaInterfaces } from '../../functionality/interfaces/AdditionsTransfersInterfaces';

export const useAdditionsTransfersService = () => {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/additions";
    const { get } = useCrudService( baseURL);

    async function GetAllAdditionsByDistrict(): Promise<ApiResponse<IAdditionsTransfersDistrictInterfaces[]>> {
        const endpoint: string = "/get-actadmin-district";
        return get(`${roleUrl}${endpoint}`);
    }

    async function GetAllAdditionsBySapiencia(): Promise<ApiResponse<IAdditionsTransfersSapienciaInterfaces[]>> {
        const endpoint: string = "/get-actadmin-sapiencia";
        return get(`${roleUrl}${endpoint}`);
    }

    return { GetAllAdditionsByDistrict, GetAllAdditionsBySapiencia }
}
