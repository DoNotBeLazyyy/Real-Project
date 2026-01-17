import { AuditDto } from '@app-types/audit.type.js';

export interface AccountProps extends AuditDto {
    // Username
    username: string;

    // Password
    password: string;

    // Initial password
    initialPassword: string;

    // User role
    userRole: string;
}