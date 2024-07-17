declare const KakaoStrategy_base: new (...args: any[]) => any;
export declare class KakaoStrategy extends KakaoStrategy_base {
    constructor();
    validate(accessToken: any, refreshToken: any, profile: any, done: any): Promise<any>;
}
export {};
