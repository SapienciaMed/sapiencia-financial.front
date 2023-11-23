import create, { SetState } from 'zustand';

interface FormItem {
  id: number;
  [key: string]: any;
}

interface StoreState {
  icdImportsData: FormItem[];
}

interface StoreActions {
  setIcdImportsData: (newValue: FormItem[] | ((prev: FormItem[]) => FormItem[])) => void;
}

const useStoreIcd = create<StoreState & StoreActions>((set: SetState<StoreState & StoreActions>) => ({
  icdImportsData: [],
  setIcdImportsData: (newValue) => {
    set((state) => ({ icdImportsData: typeof newValue === 'function' ? newValue(state.icdImportsData) : newValue }));
  },
}));

export default useStoreIcd;
