import { LoginType } from './login-type.enum';
export interface OAuth {
    username: string;
    loginType: LoginType;
    name: string;
    email?: string;
    mobileNumber?: string;
}
