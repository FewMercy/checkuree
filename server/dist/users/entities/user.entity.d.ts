import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { UserAttendance } from '../../attendances/entities/user-attendance.entity';
import { UserType } from '../const/user-type.enum';
import { LoginType } from '../../auth/const/login-type.enum';
export declare class User extends BaseTimeEntity {
    id: string;
    type: UserType;
    loginType: LoginType;
    username: string;
    password: string;
    name: string;
    mobileNumber: string;
    birthday?: string;
    birthYear?: number;
    email?: string;
    refreshToken?: string;
    isAutoLogin?: boolean;
    userAttendance: UserAttendance[];
    hashPassword(): Promise<void>;
}
