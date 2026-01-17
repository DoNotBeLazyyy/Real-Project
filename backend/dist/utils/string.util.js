export function formatTime(t) {
    const hour = parseInt(t.slice(0, 2));
    const min = t.slice(2);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h}:${min}${suffix}`;
}
