export declare class PageResponseDto<T> {
    success: boolean;
    pageSize: number;
    count: number;
    totalPage: number;
    items: T[];
    constructor(pageSize: number, count: number, items: T[], success?: boolean);
}
