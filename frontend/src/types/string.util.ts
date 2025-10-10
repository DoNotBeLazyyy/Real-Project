export function formatHeaderName(field: string) {
    return field
        .replace(/([A-Z])/g, ' $1')
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .replace(/\bId\b/g, 'ID')
        .trim();
}

type Data<T> = Record<string, keyof T>;

export function pickFields<T extends Data<T>>(data: T, basisFields: (keyof T)[]) {
    // Create a new object with only the selected keys
    return { ...basisFields.reduce((acc, key) => ({ ...acc, [key]: data[key] }), {}) };
}

export function handleFormatTime(time: string) {
    return time.replace(':', '');
}

export function toMinutes(time: string): number {
    const hours = parseInt(time.substring(0, 2), 10);
    const minutes = parseInt(time.substring(2), 10);
    return hours * 60 + minutes;
}

export function formatColumnLabel(field: string): string {
    return field
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
}