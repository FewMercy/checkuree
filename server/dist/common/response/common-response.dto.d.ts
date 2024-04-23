export declare class CommonResponseDto<T> {
    success: boolean;
    message: string;
    data?: T;
    constructor(message: string, data?: T, success?: boolean);
}
