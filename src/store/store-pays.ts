import create, { SetState } from 'zustand';

interface ErrorsStoreState {
  infoErrors: any[];
  tipoDocumentoLoad: string;
}

interface ErrorsStoreActions {
  setInfoErrors: (newValue: any[] | ((prev: any[]) => any[])) => void;
  setTipoDocumentoLoad: (newValue: string) => void; 
}

const useStorePays = create<ErrorsStoreState & ErrorsStoreActions>((set: SetState<ErrorsStoreState & ErrorsStoreActions>) => ({
  infoErrors: [],
  tipoDocumentoLoad: '',
  setInfoErrors: (newValue) => {
    set((state) => ({ infoErrors: typeof newValue === 'function' ? newValue(state.infoErrors) : newValue }));
  },
  setTipoDocumentoLoad: (newValue) => { //
    set((state) => ({ tipoDocumentoLoad: newValue }));
  },
}));

export default useStorePays;
