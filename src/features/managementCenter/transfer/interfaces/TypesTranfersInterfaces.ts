import { Dispatch, SetStateAction } from "react";
import { IArrayDataSelect, IMessage, IobjectAddTransfer } from "../../../../common/interfaces/global.interface";
import { IPagingData } from "../../../../common/utils/api-response";

export interface ITypeTransfers {
    id: number;
    name: string;
}

export interface IBasicTransfers {
    actAdminDistrict: string;
    actAdminSapiencia: string;
    observations: string
  }

export interface IPasteDataFinanceArea{
    setIsSearchByName?: (value: React.SetStateAction<boolean>) => void,
    setMessage: (values: IMessage) => void
    setDataPaste: (value: React.SetStateAction<any[]>) => void,
    arrayDataSelect: IArrayDataSelect,
    pastedInput?: any,
    isResetOutput?: boolean,
    setDetailTransferData: Dispatch<SetStateAction<IPagingData<IobjectAddTransfer>>>;
}