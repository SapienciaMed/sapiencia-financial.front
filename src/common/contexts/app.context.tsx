import {
  useState,
  createContext,
  useMemo,
  ReactElement,
  Dispatch,
  SetStateAction,
} from "react";
import { IHeadTransferData, IMessage, IMessageEdit, IobjectAddTransfer } from "../interfaces/global.interface";
import { IAuthorization } from "../interfaces/auth.interfaces";
import { IPagingData } from "../utils/api-response";

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
  addTransferData: IPagingData<IobjectAddTransfer>,
  setAddTransferData: Dispatch<SetStateAction<IPagingData<IobjectAddTransfer>>>;
}
interface IProps {
  children: ReactElement | ReactElement[];
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
  setAddTransferData: () => {}
});

export function AppContextProvider({ children }: IProps) {
  // States
  const [message, setMessage] = useState<IMessage>({} as IMessage);
  const [authorization, setAuthorization] = useState<IAuthorization>(
    {} as IAuthorization
  )
  const [messageEdit, setMessageEdit] = useState<IMessageEdit>({} as IMessageEdit);
  const [headTransferData, setHeadTransferData] = useState<IHeadTransferData>({} as IHeadTransferData)
  const [addTransferData, setAddTransferData] = useState<IPagingData<IobjectAddTransfer>>({} as IPagingData<IobjectAddTransfer>)

  // Metodo que verifica si el usuario posee permisos sobre un accion
  function validateActionAccess(indicator: string): boolean {
    return authorization.allowedActions?.findIndex((i) => i === indicator) >= 0;
  }

  const values = useMemo<IAppContext>(() => {
    return {
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
      setAddTransferData
    };
  }, [message, authorization, messageEdit, headTransferData, addTransferData]);

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}
