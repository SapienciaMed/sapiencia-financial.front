import { EResponseCodes } from "../constants/api.enum";

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

export interface IGenericList {
  id: number;
  grouper: string;
  itemCode: string;
  itemDescription: string;
  parentGrouper?: string;
  parentItemCode?: string;
}


