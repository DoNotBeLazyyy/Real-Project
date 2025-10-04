export function generateRandomPassword(cleanFacultyNumber: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    const shuffledFaculty = cleanFacultyNumber
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
    let randomChars = '';
    for (let i = 0; i < 4; i++) {
        randomChars += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${randomChars}${shuffledFaculty}`;
}