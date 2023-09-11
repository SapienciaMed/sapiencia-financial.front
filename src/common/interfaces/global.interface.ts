import { EResponseCodes } from "../constants/api.enum";
import { IDropdownProps } from "./select.interface";

export interface IMessage {
  type?: EResponseCodes;
  title?: string;
  description?: string | React.JSX.Element;
  show?: boolean;
  OkTitle?: string;
  cancelTitle?: string;
  onOk?: () => void;
  onCancel?: () => void;
  onClickOutClose?: boolean;
  onClose?: () => void;
  background?: boolean;
}

export interface IMessageEdit {
  type?: EResponseCodes;
  title?: string;
  description?: string | React.JSX.Element;
  show?: boolean;
  OkTitle?: string;
  cancelTitle?: string;
  onOk?: () => void;
  onCancel?: () => void;
  onClickOutClose?: boolean;
  onClose?: () => void;
  background?: boolean;
}

export interface IGenericList {
  id: number;
  grouper: string;
  itemCode: string;
  itemDescription: string;
  additionalFields?: object
}

export interface IAdditionalField {
  grouper: string;
  parentItemCode: string;
  fieldName?: string;
}


export interface IArrayDataSelect{
  functionalArea: IDropdownProps[],
  areas: IDropdownProps[],
  funds: IDropdownProps[],
  posPre: IDropdownProps[]
}

export interface IDropdownPropsFuctionalArea{
  description?:string;
  name: string,
  value: string | number;
  projectId?: string | number,
  id?: string | number,
}