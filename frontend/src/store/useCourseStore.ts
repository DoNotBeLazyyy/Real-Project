import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';

export interface CourseListProps {
    courseCode: string;
    courseName: string;
    faculty?: string;
    schedule: string;
    scheduleId?: string;
}

interface CourseStoreProps {
    courseList: CourseListProps[];
    setCourseList: (courses: CourseListProps[]) => void;
    clearCourses: () => void;
}

// type-safe sessionStorage wrapper
const sessionStoragePersist = {
    getItem: (name: string): StorageValue<CourseStoreProps> | Promise<StorageValue<CourseStoreProps> | null> | null => {
        const stored = sessionStorage.getItem(name);
        return stored ? JSON.parse(stored) : null;
    },
    setItem: (name: string, value: StorageValue<CourseStoreProps>) => {
        sessionStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name: string) => {
        sessionStorage.removeItem(name);
    }
};

export const useCourseStore = create<CourseStoreProps>()(
    persist(
        (set) => ({
            courseList: [],
            setCourseList: (courses: CourseListProps[]) => set({ courseList: courses }),
            clearCourses: () => set({ courseList: [] })
        }),
        {
            name: 'course-storage',
            storage: sessionStoragePersist
        }
    )
);