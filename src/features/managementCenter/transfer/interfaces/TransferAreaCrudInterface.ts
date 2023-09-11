import { Control, UseFormRegister, FieldErrors, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { IArrayDataSelect } from "../../../../common/interfaces/global.interface";

export interface ICreateSourceForm{
    origen: IAddFund[],
    destino: IAddFund[],
}

export interface IAddFund{
    managerCenter: string;
    projectId: string;
    projectName:string;
    functionalArea: string;
    funds: string;
    posPre: string;
    value: string;
    cardId:string;
}
  

export interface IAddFunds {
    titleAdd?: 'origen' | 'destino',
    control: Control<ICreateSourceForm, any>,
    register: UseFormRegister<ICreateSourceForm>,
    arrayDataSelect: IArrayDataSelect,
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<ICreateSourceForm>,
}

export interface IAddFormCard {
    titleAdd?: 'origen' | 'destino',
    control: Control<ICreateSourceForm, any>,
    arrayDataSelect: IArrayDataSelect,
    errors: FieldErrors<ICreateSourceForm>,
    count: number,
    cardId: string;
    // invalidCardsAdditionSt: any;
    setValue: UseFormSetValue<any>;
    // watch: any;
    remove: (index?: number | number[]) => void,
    register: UseFormRegister<ICreateSourceForm>,
}
