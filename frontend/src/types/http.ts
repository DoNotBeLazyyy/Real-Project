export interface Answer<T = unknown> {
    status: number;
    result: T;
    retMsg: string;
    retCode: string;
    timeZone?: string;
}