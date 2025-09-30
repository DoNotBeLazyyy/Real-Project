// String utils

// Format snake_case strings to camelCase
export function snakeToCamel<T extends Record<string, any>>(obj: T): Record<string, any> {
    const newObj: Record<string, any> = {};
    Object.keys(obj).forEach((key) => {
        const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
        newObj[camelKey] = obj[key];
    });
    return newObj;
}
