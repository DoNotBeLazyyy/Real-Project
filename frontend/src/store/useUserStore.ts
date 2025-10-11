import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';

export interface FacultyDetailProps {
    address: string;
    age: string;
    departmentCode: string;
    departmentName: string;
    email: string;
    facultyNumber: string;
    firstName: string;
    lastName: string;
    sex: string;
}

export interface StudentDetailProps {
    address: string;
    age: string;
    email: string;
    firstName: string;
    lastName: string;
    program: string;
    sex: string;
    studentNumber: string;
    yearLevel: string;
}

export type UserDetailProp = FacultyDetailProps | StudentDetailProps;

interface UserStoreProps {
    detail: UserDetailProp | null;
    isInitial: boolean;
    token: string;
    userRole: string;
    username: string;
    oldPassword: string;
    setDetail: (detail: UserDetailProp) => void;
    setOldPassword: (password: string) => void;
    setIsInitial: (condition: boolean) => void;
    setUsername: (name: string) => void;
    setUserRole: (role: string) => void;
    setToken: (token: string) => void;
    clearSession: () => void;
}

// type-safe sessionStorage wrapper
const sessionStoragePersist = {
    getItem: (name: string): StorageValue<UserStoreProps> | Promise<StorageValue<UserStoreProps> | null> | null => {
        const stored = sessionStorage.getItem(name);
        return stored ? JSON.parse(stored) : null;
    },
    setItem: (name: string, value: StorageValue<UserStoreProps>) => {
        sessionStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name: string) => {
        sessionStorage.removeItem(name);
    }
};

export const useUserStore = create<UserStoreProps>()(
    persist(
        (set) => ({
            username: '',
            userRole: '',
            token: '',
            isInitial: false,
            oldPassword: '',
            detail: null,
            setDetail: (detail: UserDetailProp) => set({ detail }),
            setIsInitial: (condition: boolean) => set({ isInitial: condition }),
            setOldPassword: (password: string) => set({ oldPassword: password }),
            setToken: (token: string) => set({ token }),
            setUserRole: (role: string) => set({ userRole: role }),
            setUsername: (name: string) => set({ username: name }),
            clearSession: () =>
                set({
                    username: '',
                    userRole: '',
                    token: '',
                    isInitial: false,
                    oldPassword: '',
                    detail: null
                })
        }),
        {
            name: 'user-storage',
            storage: sessionStoragePersist
        }
    )
);