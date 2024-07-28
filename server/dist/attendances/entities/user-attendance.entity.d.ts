import { User } from '../../users/entities/user.entity';
import { Attendance } from './attendance.entity';
import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { RoleType } from '../../roles/const/role-type.enum';
export declare class UserAttendance extends BaseTimeEntity {
    userAttendanceId: number;
    userId: string;
    attendanceId: string;
    role: RoleType;
    user: User;
    attendance: Attendance;
}
