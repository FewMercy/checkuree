import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { Attendance } from '../../attendances/entities/attendance.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { Record } from '../../records/entities/record.entity';
import { AttendeeGrade } from '../grade.enum';
import { Gender } from '../gender.enum';
export declare class Attendee extends BaseTimeEntity {
    id: string;
    attendanceId: string;
    name: string;
    gender: Gender;
    mobileNumber: string;
    subMobileNumber: string;
    birth?: string;
    course?: string;
    school?: string;
    grade?: AttendeeGrade;
    description: string;
    attendance: Attendance;
    schedules: Schedule[];
    records: Record[];
}
