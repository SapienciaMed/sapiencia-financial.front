import {
  useState,
  createContext,
  useMemo,
  ReactElement,
  Dispatch,
  SetStateAction,
} from "react";
import { IMessage, IMessageEdit } from "../interfaces/global.interface";
import { IAuthorization } from "../interfaces/auth.interfaces";

interface IAppContext {
  authorization: IAuthorization;
  setAuthorization: Dispatch<SetStateAction<IAuthorization>>;
  message: IMessage;
  setMessage: Dispatch<SetStateAction<IMessage>>;
  messageEdit: IMessageEdit;
  setMessageEdit: Dispatch<SetStateAction<IMessageEdit>>;
}
interface IProps {
  children: ReactElement | ReactElement[];
}

export const AppContext = createContext<IAppContext>({
  authorization: {} as IAuthorization,
  setAuthorization: () => {},
  message: {} as IMessage,
  setMessage: () => {},
  messageEdit: {} as IMessageEdit,
  setMessageEdit: () => {},
});

export function AppContextProvider({ children }: IProps) {
  // States
  const [message, setMessage] = useState<IMessage>({} as IMessage);
  const [authorization, setAuthorization] = useState<IAuthorization>(
    {} as IAuthorization
  )
  const [messageEdit, setMessageEdit] = useState<IMessageEdit>({} as IMessageEdit); ;

  const values = useMemo<IAppContext>(() => {
    return {
      authorization,
      setAuthorization,
      message,
      setMessage,
      messageEdit,
      setMessageEdit,
    };
  }, [message, authorization,messageEdit]);

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}
