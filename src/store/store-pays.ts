import create, { SetState } from 'zustand';

interface ErrorsStoreState {
  infoErrors: any[];
  infoSearchPays: any[];
  tipoDocumentoLoad: string;
  exerciseLoad: string;
  loadingSpinner: boolean;
  fieldErrors: {
    tipoArchivo?: string;
    mesDelAnio?: string;
  };
}

interface ErrorsStoreActions {
  setInfoErrors: (newValue: any[] | ((prev: any[]) => any[])) => void;
  setInfoSearchPays: (newValue: any[] | ((prev: any[]) => any[])) => void;
  setTipoDocumentoLoad: (newValue: string) => void;
  setExerciseLoad: (newValue: string) => void;
  setLoadingSpinner: (newValue: boolean) => void;
  setFieldErrors: (newValue: { tipoArchivo?: string; mesDelAnio?: string }) => void;
}

const useStorePays = create<ErrorsStoreState & ErrorsStoreActions>((set: SetState<ErrorsStoreState & ErrorsStoreActions>) => ({
  infoErrors: [],
  infoSearchPays: [],
  tipoDocumentoLoad: '',
  exerciseLoad: '',
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
  setExerciseLoad: (newValue) => {
    set((state) => ({ exerciseLoad: newValue }));
  },
  setLoadingSpinner: (newValue) => {
    set((state) => ({ loadingSpinner: newValue }));
  },
  setFieldErrors: (newValue) => {
    set((state) => ({ fieldErrors: { ...state.fieldErrors, ...newValue } }));
  },
  setInfoSearchPays: (newValue) => {
    set((state) => ({ infoSearchPays: { ...state.infoSearchPays, ...newValue } }));
  },
}));

export default useStorePays;
