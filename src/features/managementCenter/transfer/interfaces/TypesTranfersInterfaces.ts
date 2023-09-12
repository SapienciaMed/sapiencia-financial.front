import { IArrayDataSelect, IMessage } from "../../../../common/interfaces/global.interface";

export interface ITypeTransfers {
    id: number;
    name: string;
}

export interface IBasicTransfers {
    // page: number;
    // perPage: number;
    adminDistrict: string;
    adminSapiencia: string;
    remarks: string
  }

export interface IPasteDataFinanceArea{
    setIsSearchByName?: (value: React.SetStateAction<boolean>) => void,
    setMessage: (values: IMessage) => void
    setDataPaste: (value: React.SetStateAction<any[]>) => void,
    arrayDataSelect: IArrayDataSelect,
    validationIn: 'adicion' | 'traslado',
    pastedInput?: any,
}