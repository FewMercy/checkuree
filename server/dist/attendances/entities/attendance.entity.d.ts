import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { UserAttendance } from './user-attendance.entity';
import { Attendee } from '../../attendees/entities/attendee.entity';
import { AttendanceDay } from './attendance-day.entity';
import { DayType } from '../../schedules/const/day-type.enum';
export declare class Attendance extends BaseTimeEntity {
    id: string;
    title: string;
    description: string;
    availableFrom: string;
    availableTo: string;
    allowLateness: boolean;
    imageUrl?: string;
    userAttendance: UserAttendance[];
    attendees: Attendee[];
    attendanceDays: AttendanceDay[];
    days: DayType[];
}
