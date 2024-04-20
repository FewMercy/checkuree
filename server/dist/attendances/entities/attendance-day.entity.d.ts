import { Attendance } from './attendance.entity';
import { DayType } from '../../schedules/const/day-type.enum';
export declare class AttendanceDay {
    id: number;
    attendanceId: string;
    day: DayType;
    attendance: Attendance;
}
