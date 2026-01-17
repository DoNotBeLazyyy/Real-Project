export interface AuditDto {
    // Who created the record
    createdBy: string;

    // When the record was created
    createdAt: string;

    // Who last updated the record
    updatedBy?: string;

    // When the record was last updated
    updatedAt?: string;
}