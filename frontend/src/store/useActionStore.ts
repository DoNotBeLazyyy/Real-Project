import { create } from 'zustand';

interface ModalState {
  isModify: boolean;
  isDelete: boolean;
  isAddRemove: boolean;
  setAction: <K extends keyof Omit<ModalState, 'setAction'>>(key: K, value: ModalState[K]) => void;
}

export const useActionStore = create<ModalState>((set) => ({
    isModify: false,
    isDelete: false,
    isAddRemove: false,
    setAction: (key, value) => set({ [key]: value } as unknown as ModalState)
}));