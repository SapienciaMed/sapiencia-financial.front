import create, { SetState } from 'zustand';

interface ErrorsStoreState {
  infoErrors: any[];
  tipoDocumentoLoad: string;
  loadingSpinner: boolean;
}

interface ErrorsStoreActions {
  setInfoErrors: (newValue: any[] | ((prev: any[]) => any[])) => void;
  setTipoDocumentoLoad: (newValue: string) => void;
  setLoadingSpinner: (newValue: boolean) => void;
}

const useStoreCdp = create<ErrorsStoreState & ErrorsStoreActions>((set: SetState<ErrorsStoreState & ErrorsStoreActions>) => ({
  infoErrors: [],
  tipoDocumentoLoad: '',
  loadingSpinner: false, // Agregamos la propiedad loadingSpinner con su valor por defecto
  setInfoErrors: (newValue) => {
    set((state) => ({ infoErrors: typeof newValue === 'function' ? newValue(state.infoErrors) : newValue }));
  },
  setTipoDocumentoLoad: (newValue) => {
    set((state) => ({ tipoDocumentoLoad: newValue }));
  },
  setLoadingSpinner: (newValue) => {
    set((state) => ({ loadingSpinner: newValue }));
  },
}));

export default useStoreCdp;
