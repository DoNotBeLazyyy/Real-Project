export function getMinWidth<T>(data: T[], field: keyof T, charWidth = 8, padding = 16) {
    const maxLength = Math.max(
        ...data.map((row) => (row[field] ? String(row[field]).length : 0)),
        String(field).length
    );

    return maxLength * charWidth + padding;
}