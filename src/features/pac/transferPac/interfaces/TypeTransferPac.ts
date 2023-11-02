import { ICreateTransferPacForm } from "../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface"
import { UseFormSetValue, UseFormRegister, FieldErrors, Control, UseFormReset } from 'react-hook-form';
import { IDropdownProps } from "../../../../common/interfaces/select.interface";
import { Dispatch, SetStateAction } from "react";
import { IAnnualRoute } from "../../interface/Pac";

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
  disableBtnAdd: boolean,
  setIsdataResetState: Dispatch<SetStateAction<boolean>>,
  setAnnualDataRoutesOriginal: React.Dispatch<React.SetStateAction<{
    annualRouteService: IAnnualRoute[];
  }[]>>,
  annualDataRoutesOriginal:  {
    annualRouteService: IAnnualRoute[];
  }[],
  originalDestinationValueOfService: {
    annualRouteService: IAnnualRoute[];
  }[],
  setOriginalDestinationValueOfService: React.Dispatch<React.SetStateAction<{
    annualRouteService: IAnnualRoute[];
    ubicacion?: string
  }[]>>,
  addNewObject: (value: any) => void,
}

export interface IArrayDataSelectHead {
  typeResourceData: IDropdownProps[],
  validityData: IDropdownProps[],
}

export interface IArrayDataSelectPac{
  functionalArea: IDropdownPropsPac[],
  fundsSapiencia: IDropdownPropsPac[],
  pospreSapiencia: IDropdownPropsPac[],
  listProjects?:  IDropdownPropsPac[]
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
  