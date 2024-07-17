import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Invitation } from './entities/invitation.entity';
export declare class InvitationsService {
    private invitationRepository;
    constructor(invitationRepository: Repository<Invitation>);
    invite(createInvitationDto: CreateInvitationDto, user: User): Promise<string>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateInvitationDto: UpdateInvitationDto): string;
    remove(id: number): string;
}
