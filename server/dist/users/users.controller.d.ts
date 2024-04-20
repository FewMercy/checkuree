import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Pagination } from '../common/response/pagination';
import { User } from './entities/user.entity';
import { CommonResponseDto } from '../common/response/common-response.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(pagination: Pagination): Promise<{
        list: User[];
        count: number;
    }>;
    findOneByMobileNumber(mobileNumber: string): Promise<User>;
    findOneId(id: string): Promise<string>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<string>;
    softDelete(id: string, userId: string): Promise<CommonResponseDto<any>>;
}
