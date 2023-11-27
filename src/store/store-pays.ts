import create, { SetState } from 'zustand';

interface ErrorsStoreState {
  infoErrors: any[]; 
  otraVariable: string; 
}

interface ErrorsStoreActions {
  setInfoErrors: (newValue: any[] | ((prev: any[]) => any[])) => void;
  setOtraVariable: (newValue: string) => void; 
}

const useStorePays = create<ErrorsStoreState & ErrorsStoreActions>((set: SetState<ErrorsStoreState & ErrorsStoreActions>) => ({
  infoErrors: [],
  otraVariable: '', 
  setInfoErrors: (newValue) => {
    set((state) => ({ infoErrors: typeof newValue === 'function' ? newValue(state.infoErrors) : newValue }));
  },
  setOtraVariable: (newValue) => {
    set((state) => ({ otraVariable: newValue }));
  },
}));

export default useStorePays;
