
import React from 'react'
import useCrudService from '../../../../common/hooks/crud-service.hook';
import { ApiResponse } from '../../../../common/utils';

export const usePacTransfersService = () => {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/additions"; // posiblemente cambia....
    const { get, post } = useCrudService( baseURL);

    // posiblemente cambiar nombre (obtiene el encabezado)
    async function GetAllPacTransfers(): Promise<ApiResponse<any[]>> { // cambiar el tipo any
        const endpoint: string = "/algo-para-consultar-encabezado"; // cambia...
        return get(`${roleUrl}${endpoint}`);
    }

    // posiblemente cambiar nombre(enviar los parametros para consultar cada ruta)
    async function GetAllPacAssets(data: Object): Promise<ApiResponse<any[]>> { // cambiar el tipo any
        const endpoint: string = "/algo-para-consultar-ruta"; // cambia...
        return post(`${roleUrl}${endpoint}`, data);
    }

    // posiblemente cambiar nombre(enviar los parametros para guardar cada ruta)
    async function CreateTransferPac(data: Object): Promise<ApiResponse<any[]>> { // cambiar el tipo any
        const endpoint: string = "/algo-para-gurdar"; // cambia...
        return post(`${roleUrl}${endpoint}`,data);
    }
    

    return {
        GetAllPacTransfers,
        GetAllPacAssets,
        CreateTransferPac
    }
}
