import { User } from '../../users/entities/user.entity';
export declare class CreateAuthDto {
    username: string;
    password: string;
    name: string;
    mobileNumber: string;
    birthYear?: string;
    birthday?: string;
    email?: string;
    toEntity(createdAt?: Date): User;
}
