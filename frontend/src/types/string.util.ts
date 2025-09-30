export function formatHeaderName(field: string) {
    return field
        .replace(/([A-Z])/g, ' $1')
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .replace(/\bId\b/g, 'ID')
        .trim();
}