import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CommonResponseDto } from '../common/response/common-response.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findOneByMobileNumber(mobileNumber: string): Promise<User>;
    findOneId(user: User): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<string>;
    softDelete(id: string, userId: string): Promise<CommonResponseDto<any>>;
}
