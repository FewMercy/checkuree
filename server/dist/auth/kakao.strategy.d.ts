import { Strategy } from 'passport-kakao';
declare const KakaoStrategy_base: new (...args: any[]) => Strategy;
export declare class KakaoStrategy extends KakaoStrategy_base {
    constructor();
    validate(accessToken: any, refreshToken: any, profile: any, done: any): Promise<any>;
}
export {};
