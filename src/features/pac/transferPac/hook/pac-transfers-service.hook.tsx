
import React from 'react'
import useCrudService from '../../../../common/hooks/crud-service.hook';
import { ApiResponse } from '../../../../common/utils';
import { DataTransferPac, IPacAnnualAdapter, IPacComplementary, IPacFilters, IResultSearchAnnualizationByRoute } from '../../interface/Pac';
import { IPagingData } from '../../../../common/utils/api-response';


export const usePacTransfersService = () => {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/pac"; 
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

    
    async function ListDinamicsRoutes(data: Object): Promise<ApiResponse<IPacComplementary>> {
        const endpoint: string = "/lists-dinamics-routes";
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function SearchAnnualDataRoutes(data: Object):  Promise<ApiResponse<IResultSearchAnnualizationByRoute>> {
        const endpoint: string = "/search-annualdata-routes";
        return post(`${roleUrl}${endpoint}`, data);
    }

    async function TransfersOnPac(data: DataTransferPac): Promise<ApiResponse<any>> { // cambiar el tipo any
        const endpoint: string = "/transfers-pac"; 
        return post(`${roleUrl}${endpoint}`,data);
    }
    
    return {
        ValidityList,
        ListDinamicsRoutes,
        TransfersOnPac,
        ResourcesTypeList,
        SearchAnnualDataRoutes
    }
}
