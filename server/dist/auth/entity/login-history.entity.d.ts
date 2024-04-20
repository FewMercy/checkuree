import { User } from '../../users/entities/user.entity';
export declare class LoginHistory {
    id: number;
    userId: string;
    currentIp: string;
    loginAt: Date;
    user: User;
}
