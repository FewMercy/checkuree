export declare abstract class Pagination {
    pageNo: number;
    pageSize: number;
    getOffset(): number;
    getLimit(): number;
}
