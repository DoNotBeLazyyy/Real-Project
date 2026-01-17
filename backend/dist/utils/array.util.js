// Array utils
import { snakeToCamel } from './table.utils.js';
// Checks for valid array
export function invalidArray(data) {
    return !Array.isArray(data) || data.length < 1;
}
// Format table attributes to camelCase
export function snakeToCamelArray(arr) {
    return arr.map(snakeToCamel);
}
