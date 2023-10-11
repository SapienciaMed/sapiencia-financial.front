
import React from 'react'
import useCrudService from '../../../../common/hooks/crud-service.hook';
import { ApiResponse } from '../../../../common/utils';
import { IPacComplementary, IPacFilters } from '../../interface/Pac';
import { IPagingData } from '../../../../common/utils/api-response';


export const usePacTransfersService = () => {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/pac"; // posiblemente cambia....
    const { get, post } = useCrudService( baseURL);

    // obtiene vigencia
    async function ValidityList(): Promise<ApiResponse<IPagingData<IPacFilters>>> {
        const endpoint: string = "/validity-list"; 
        return post(`${roleUrl}${endpoint}`);
    }

    //Obtiene tipo de recurso dependiendo de la vigencia
    async function ResourcesTypeList(data: Object): Promise<ApiResponse<IPagingData<IPacFilters>>> { 
        const endpoint: string = "/resources-type-list"; 
        return post(`${roleUrl}${endpoint}`, data);
    }

    
    async function ListDinamicsRoutes(data: Object): Promise<ApiResponse<IPacComplementary>> { // cambiar el tipo any
        const endpoint: string = "/lists-dinamics-routes";
        return post(`${roleUrl}${endpoint}`, data);
    }

    // posiblemente cambiar nombre(enviar los parametros para guardar cada ruta)
    async function CreateTransferPac(data: Object): Promise<ApiResponse<any[]>> { // cambiar el tipo any
        const endpoint: string = "/algo-para-gurdar"; // cambia...
        return post(`${roleUrl}${endpoint}`,data);
    }
    

    return {
        ValidityList,
        ListDinamicsRoutes,
        CreateTransferPac,
        ResourcesTypeList
    }
}
