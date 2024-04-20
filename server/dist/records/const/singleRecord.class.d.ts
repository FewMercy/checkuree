import { AttendanceStatus } from './record-type.enum';
import { DayType } from '../../schedules/const/day-type.enum';
import { LateTimeType } from './late-time-type.enum';
import { AbsenceType } from './absence-type.enum';
export declare class SingleRecord {
    status: AttendanceStatus;
    attendeeId: string;
    date: string;
    day: DayType;
    etc: string;
    lateTime: LateTimeType;
    absenceType: AbsenceType;
}
