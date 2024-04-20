import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { Attendance } from '../../attendances/entities/attendance.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { Record } from '../../records/entities/record.entity';
export declare class Attendee extends BaseTimeEntity {
    id: string;
    attendanceId: string;
    name: string;
    mobileNumber: string;
    subMobileNumber: string;
    age: number;
    description: string;
    attendance: Attendance;
    schedules: Schedule[];
    records: Record[];
}
