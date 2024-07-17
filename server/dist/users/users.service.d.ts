import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Pagination } from '../common/response/pagination';
import { CommonResponseDto } from '../common/response/common-response.dto';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findAll(pagination: Pagination): Promise<{
        list: User[];
        count: number;
    }>;
    findOne(id: string): Promise<User>;
    findOneById(id: string): Promise<User>;
    findOneByMobileNumber(mobileNumber: string): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<string>;
    softDelete(id: string, userId: string): Promise<CommonResponseDto<null>>;
}
