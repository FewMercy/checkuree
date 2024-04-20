import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { RoleType } from '../../roles/entities/role-type.enum';
import { User } from '../../users/entities/user.entity';
import { InvitationStatusType } from '../invitation-status.enum';
export declare class Invitation extends BaseTimeEntity {
    id: number;
    attendanceId: string;
    role: RoleType;
    status: InvitationStatusType;
    invitee: User;
}
