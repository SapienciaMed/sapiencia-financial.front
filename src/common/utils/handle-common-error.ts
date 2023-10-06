import { SetStateAction } from "react";
import { ApiResponse, IPagingData } from "./api-response";
import { IMessage, IobjectAddTransfer } from "../interfaces/global.interface";
import { cleanTransferContext } from "./clean-transfer-context";
import { IProjectAdditionList } from "../../features/functionality/interfaces/AdditionsTransfersInterfaces";

interface IHandleCommonError {
    response: ApiResponse<any>,
    setMessage: (value: SetStateAction<IMessage>) => void,
    navigate: any,
    setAddTransferData: (value: SetStateAction<IPagingData<IobjectAddTransfer>>) => void,
    setDetailTransferData: (value: SetStateAction<IPagingData<IobjectAddTransfer>>) => void
}

export const handleCommonError = ({ response, setMessage,  navigate, setAddTransferData, setDetailTransferData}: IHandleCommonError) => {
    setMessage({
        title: 'Error en la consulta de datos',
        show: true,
        description: response.operation.message,
        OkTitle: 'Aceptar',
        background: true,
        onOk: () => {
            setMessage({});
            cleanTransferContext({ setAddTransferData, setDetailTransferData });
            navigate(-1);
        },
        onClose: () => {
            setMessage({});
            cleanTransferContext({ setAddTransferData, setDetailTransferData });
            navigate(-1);
        },
    });
}