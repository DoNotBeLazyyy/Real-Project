export interface MakeResponseProps<T = unknown> {
    result?: T;
    retCode?: string;
    retMsg?: string;
    status?: number;
    timeZone?: string;
}