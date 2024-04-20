import { Strategy } from 'passport-jwt';
import { JwtPayload } from '../const/jwtPayload.interface';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: JwtPayload): Promise<{
        id: string;
        username: string;
        userAttendance: import("../../attendances/entities/user-attendance.entity").UserAttendance[];
    }>;
}
export {};
