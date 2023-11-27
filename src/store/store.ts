import create, { SetState } from 'zustand';

interface FormItem {
  id: number;
  [key: string]: any;
}

interface StoreState {
  formDataCdpRoute: FormItem[];
}

interface StoreActions {
  setFormDataCdpRoute: (newValue: FormItem[] | ((prev: FormItem[]) => FormItem[])) => void;
}

const useStore = create<StoreState & StoreActions>((set: SetState<StoreState & StoreActions>) => ({
  formDataCdpRoute: [],
  setFormDataCdpRoute: (newValue) => {
    set((state) => ({ formDataCdpRoute: typeof newValue === 'function' ? newValue(state.formDataCdpRoute) : newValue }));
  },
}));

export default useStore;
