// Array utils

import { snakeToCamel } from './table.utils.js';

// Checks for valid array
export function invalidArray<T>(data: T[]) {
    return !Array.isArray(data) || data.length < 1;
}

// Format table attributes to camelCase
export function snakeToCamelArray<T extends Record<string, any>>(arr: T[]): Record<string, any>[] {
    return arr.map(snakeToCamel);
}