import React, { useState, createContext, useMemo, ReactElement, Dispatch, SetStateAction } from "react";
import { IDataPaste, IHeadTransferData, IMessage, IMessageEdit, IobjectAddTransfer } from "../interfaces/global.interface";
import { IAuthorization } from "../interfaces/auth.interfaces";
import { IPagingData } from "../utils/api-response";
import { IEditPac } from "../../features/pac/interface/Pac";

interface IAppContext {
  authorization: IAuthorization;
  setAuthorization: Dispatch<SetStateAction<IAuthorization>>;
  message: IMessage;
  setMessage: Dispatch<SetStateAction<IMessage>>;
  validateActionAccess: (indicator: string) => boolean;
  messageEdit: IMessageEdit;
  setMessageEdit: Dispatch<SetStateAction<IMessageEdit>>;
  headTransferData: IHeadTransferData;
  setHeadTransferData: Dispatch<SetStateAction<IHeadTransferData>>;
  addTransferData: IPagingData<IobjectAddTransfer>;
  setAddTransferData: Dispatch<SetStateAction<IPagingData<IobjectAddTransfer>>>;
  dataPasteRedux: IDataPaste[];
  setDataPasteRedux: Dispatch<SetStateAction<IDataPaste[]>>;
  detailTransferData: IPagingData<IobjectAddTransfer>;
  setDetailTransferData: Dispatch<SetStateAction<IPagingData<IobjectAddTransfer>>>;
  isValue: boolean;
  setIsValue: Dispatch<SetStateAction<boolean>>;
  condensedQueryData: IEditPac
  setCondensedQueryData: Dispatch<SetStateAction<IEditPac>>
  formInfo: FormInfoType;
  setFormInfo: Dispatch<SetStateAction<FormInfoType>>;
}

interface IProps {
  children: ReactElement | ReactElement[];
}

interface FormInfoType {
  id: number;
  proyecto: string;
  posicion: string;
  valorInicial: string;
  balance: string;
}

export const AppContext = createContext<IAppContext>({
  authorization: {} as IAuthorization,
  setAuthorization: () => {},
  message: {} as IMessage,
  setMessage: () => {},
  validateActionAccess: () => true,
  messageEdit: {} as IMessageEdit,
  setMessageEdit: () => {},
  headTransferData: {} as IHeadTransferData,
  setHeadTransferData: () => {},
  addTransferData: {} as IPagingData<IobjectAddTransfer>,
  setAddTransferData: () => {},
  dataPasteRedux: [] as IDataPaste[],
  setDataPasteRedux: () => {},
  detailTransferData: {} as IPagingData<IobjectAddTransfer>,
  setDetailTransferData: () => {},
  isValue: false,
  setIsValue: () => {},
  formInfo: {
    id: 0,
    proyecto: "",
    posicion: "",
    valorInicial: "",
    balance: "",
  },
  setFormInfo: () => {},
  condensedQueryData: {} as IEditPac,
  setCondensedQueryData: () => {}
});

export function AppContextProvider({ children }: IProps) {
  const [message, setMessage] = useState<IMessage>({} as IMessage);
  const [authorization, setAuthorization] = useState<IAuthorization>({} as IAuthorization);
  const [messageEdit, setMessageEdit] = useState<IMessageEdit>({} as IMessageEdit);
  const [headTransferData, setHeadTransferData] = useState<IHeadTransferData>({} as IHeadTransferData);
  const [addTransferData, setAddTransferData] = useState<IPagingData<IobjectAddTransfer>>({} as IPagingData<IobjectAddTransfer>);
  const [dataPasteRedux, setDataPasteRedux] = useState<IDataPaste[]>({} as IDataPaste[]);
  const [detailTransferData, setDetailTransferData] = useState<IPagingData<IobjectAddTransfer>>({} as IPagingData<IobjectAddTransfer>);
  const [isValue, setIsValue] = useState<boolean>(null as boolean);
  const [formInfo, setFormInfo] = useState<FormInfoType>({
    proyecto: "",
    posicion: "",
    valorInicial: "",
    balance: "",
    id: 0,
  });
  const [condensedQueryData, setCondensedQueryData] = useState<IEditPac>({} as IEditPac)

  function validateActionAccess(indicator: string): boolean {
    return authorization.allowedActions?.findIndex((i) => i === indicator) >= 0;
  }

  const values = useMemo<IAppContext>(
    () => ({
      authorization,
      setAuthorization,
      message,
      setMessage,
      validateActionAccess,
      messageEdit,
      setMessageEdit,
      headTransferData,
      setHeadTransferData,
      addTransferData,
      setAddTransferData,
      dataPasteRedux,
      setDataPasteRedux,
      detailTransferData,
      setDetailTransferData,
      isValue,
      setIsValue,
      formInfo,
      setFormInfo,
      condensedQueryData,
      setCondensedQueryData
    }),
    [message, authorization, messageEdit, headTransferData, addTransferData, dataPasteRedux, detailTransferData, isValue, condensedQueryData]
  );

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}
