export declare class ResponseWithoutPaginationDto<T> {
    success: boolean;
    count: number;
    items: T[];
    constructor(count: number, items: T[], success?: boolean);
}
