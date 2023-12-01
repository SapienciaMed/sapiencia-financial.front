import create, { SetState } from 'zustand';

interface ErrorsStoreState {
  infoErrors: any[];
  tipoDocumentoLoad: string;
  loadingSpinner: boolean;
  fieldErrors: {
    tipoArchivo?: string;
    mesDelAnio?: string;
  };
}

interface ErrorsStoreActions {
  setInfoErrors: (newValue: any[] | ((prev: any[]) => any[])) => void;
  setTipoDocumentoLoad: (newValue: string) => void;
  setLoadingSpinner: (newValue: boolean) => void;
  setFieldErrors: (newValue: { tipoArchivo?: string; mesDelAnio?: string }) => void;
}

const useStorePays = create<ErrorsStoreState & ErrorsStoreActions>((set: SetState<ErrorsStoreState & ErrorsStoreActions>) => ({
  infoErrors: [],
  tipoDocumentoLoad: '',
  loadingSpinner: false,
  fieldErrors: {
    tipoArchivo: '',
    mesDelAnio: '',
  },
  setInfoErrors: (newValue) => {
    set((state) => ({ infoErrors: typeof newValue === 'function' ? newValue(state.infoErrors) : newValue }));
  },
  setTipoDocumentoLoad: (newValue) => {
    set((state) => ({ tipoDocumentoLoad: newValue }));
  },
  setLoadingSpinner: (newValue) => {
    set((state) => ({ loadingSpinner: newValue }));
  },
  setFieldErrors: (newValue) => {
    set((state) => ({ fieldErrors: { ...state.fieldErrors, ...newValue } }));
  },
}));

export default useStorePays;
