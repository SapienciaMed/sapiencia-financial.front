import create, { SetState } from 'zustand';

interface FormItem {
  id: number;
  [key: string]: any;
}

interface StoreState {
  totalDataRuta: FormItem[];
}

interface StoreActions {
  setTotalDataRuta: (newValue: FormItem[] | ((prev: FormItem[]) => FormItem[])) => void;
}

const useStoreTwo = create<StoreState & StoreActions>((set: SetState<StoreState & StoreActions>) => ({
  totalDataRuta: [],
  setTotalDataRuta: (newValue) => {
    set((state) => ({ totalDataRuta: typeof newValue === 'function' ? newValue(state.totalDataRuta) : newValue }));
  },
}));

export default useStoreTwo;
