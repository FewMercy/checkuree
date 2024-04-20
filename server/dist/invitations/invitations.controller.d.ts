import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { User } from '../users/entities/user.entity';
export declare class InvitationsController {
    private readonly invitationsService;
    constructor(invitationsService: InvitationsService);
    create(createInvitationDto: CreateInvitationDto, user: User): Promise<string>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateInvitationDto: UpdateInvitationDto): string;
    remove(id: string): string;
}
