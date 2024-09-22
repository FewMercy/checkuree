import { AttendanceStatus } from './record-type.enum';
import { DayType } from '../../schedules/const/day-type.enum';
import { LateTimeType } from './late-time-type.enum';
import { AbsenceType } from './absence-type.enum';
export declare class SingleRecord {
    attendeeId: string;
    date: string;
    time: string;
    day: DayType;
    status: AttendanceStatus;
    lateTime: LateTimeType;
    absenceType: AbsenceType;
    etc: string;
}
