import { create } from 'zustand';

interface DataStore<TData> {
  allRows: TData[];
  modifiedRows: TData[];
  newRowData: TData[];
  rowData: TData[];
  selectedRowData: string[];
  totalDataCount: number;
  setData: <K extends keyof DataStore<TData>>(
    key: K,
    value: DataStore<TData>[K] | ((prev: DataStore<TData>[K]) => DataStore<TData>[K])
  ) => void;
  setTotalDataCount: (value: number) => void;
  reset: () => void;
}

export function createDataStore<TData>() {
    const useStore = create<DataStore<TData>>((set) => ({
        allRows: [],
        modifiedRows: [],
        newRowData: [],
        rowData: [],
        selectedRowData: [],
        totalDataCount: 0,
        setData: <K extends keyof DataStore<TData>>(
            key: K,
            value: DataStore<TData>[K] | ((prev: DataStore<TData>[K]) => DataStore<TData>[K])
        ) => set((prev) => ({
            ...prev,
            [key]:
              typeof value === 'function'
                  ? (value as (prevValue: DataStore<TData>[K]) => DataStore<TData>[K])(prev[key])
                  : value
        })),
        setTotalDataCount: (value) => set({ totalDataCount: value }),
        reset: () =>
            set({
                modifiedRows: [],
                newRowData: [],
                selectedRowData: []
            })
    }));

    return function useDataStore() {
        return useStore((state) => state);
    };
}