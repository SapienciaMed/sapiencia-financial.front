import { Control, UseFormRegister, FieldErrors, UseFormSetValue, UseFormGetValues, UseFormResetField, UseFieldArrayRemove } from 'react-hook-form';
import { IArrayDataSelect } from "../../../../common/interfaces/global.interface";

export interface ICreateSourceForm{
    origen: IAddFund[];
    destino: IAddFund[];
}

export interface ICreateTransferPacForm{
    origen: IAddFundPac[];
    destino: IAddFundPac[]; 
    pacType: number;
    validity: number;
    TypeResource: number
}

export interface IAddFundPac extends IAddFund{
    collected: IMonths,
    programmed: IMonths
}

export interface IAddFund{
    managerCenter: string;
    projectId: string;
    projectName?: string;
    functionalArea: string;
    pospreSapiencia?: string;
    funds?: string;
    fundsSapiencia?: string;
    posPre?: string;
    value?: string;
    cardId?:string;
    typeTransfer?:string;
}
  

export interface IAddFunds {
    titleAdd?: 'origen' | 'destino',
    control: Control<ICreateSourceForm, any>,
    register: UseFormRegister<ICreateSourceForm>,
    arrayDataSelect: IArrayDataSelect,
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<ICreateSourceForm>,
    setDataPaste?: (value: React.SetStateAction<any[]>) => void,
    dataPaste?: any[],
    invalidCardsAdditionSt:any;
    watch:any;
}

export interface IAddFormCard {
    titleAdd?: 'origen' | 'destino',
    control: Control<ICreateSourceForm, any>,
    arrayDataSelect: IArrayDataSelect,
    errors: FieldErrors<ICreateSourceForm>,
    count: number,
    cardId: string;
    setValue: UseFormSetValue<any>;
    removeCard: (index?: number | number[]) => void,
    register: UseFormRegister<ICreateSourceForm>,
    titleLabelValue: string,
    invalidCardsAdditionSt:any;
    watch:any;
}

export interface IFormTransferPac {
    titleAdd?: 'origen' | 'destino',
    control: Control<ICreateTransferPacForm, any>,
    arrayDataSelect: IArrayDataSelect,
    errors: FieldErrors<ICreateTransferPacForm>,
    count: number,
    cardId: string;
    setValue: UseFormSetValue<any>;
    register: UseFormRegister<ICreateTransferPacForm>,
    pacTypeState: number,
}

export interface IFormPacmonths{
    titleAdd?: 'origen' | 'destino',
    control: Control<ICreateTransferPacForm, any>,
    count: number,
    pacTypeMonth: 'collected' | 'programmed' | 'both'
    titleActive: string
}

export interface IMonths{
    january: string ,
    february: string  ,
    march: string ,
    april: string ,
    may: string ,
    june: string ,
    july: string ,
    august: string ,
    september: string ,
    october: string ,
    november: string ,
    december: string 
}