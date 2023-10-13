import { ICreateTransferPacForm } from "../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface"
import { UseFormSetValue, UseFormRegister, FieldErrors, Control } from 'react-hook-form';
import { IArrayDataSelect } from '../../../../common/interfaces/global.interface';
import { IDropdownProps } from "../../../../common/interfaces/select.interface";
import { Dispatch, SetStateAction } from "react";

export interface ICreateFundTransferPac {
    titleAdd: 'origen' | 'destino',
    control: Control<ICreateTransferPacForm, any>
    arrayDataSelect: IArrayDataSelectPac, 
    errors: FieldErrors<ICreateTransferPacForm>, 
    register: UseFormRegister<ICreateTransferPacForm>, 
    setValue: UseFormSetValue<ICreateTransferPacForm>,
    isdataReset: boolean,
    pacTypeState: number,
    itemsPerPage: number,
    startIndex: number,
    isActivityAdd: boolean,
    cardIdService: string,
    setIsdataResetState: Dispatch<SetStateAction<boolean>>,
    annualDataRoutes: {
      annualRoute: any[]
    }
}

export interface IArrayDataSelectHead {
    typeResourceData: IDropdownProps[],
    validityData: IDropdownProps[],
}

export interface IArrayDataSelectPac{
    functionalArea: IDropdownPropsPac[],
    fundsSapiencia: IDropdownPropsPac[],
    pospreSapiencia: IDropdownPropsPac[]
  }
  
  export interface IDropdownPropsPac {
    name: string,
    value: string | number;
    functionalArea?: string,
    nameProject?: string,
    idProjectPlanning?: number,
    descriptionSapi?: string,
    idPosPreOrig?: number,
    numberCodeOrig?: string
    id?: string | number,
    numberFunctionalArea?: string
  }
  