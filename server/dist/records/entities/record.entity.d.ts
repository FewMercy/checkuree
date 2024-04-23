import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { AttendanceStatus } from '../const/record-type.enum';
import { DayType } from '../../schedules/const/day-type.enum';
import { Attendee } from '../../attendees/entities/attendee.entity';
import { LateTimeType } from '../const/late-time-type.enum';
import { AbsenceType } from '../const/absence-type.enum';
export declare class Record extends BaseTimeEntity {
    id: number;
    attendeeId: string;
    status: AttendanceStatus;
    date: string;
    day: DayType;
    etc: string;
    lateTime: LateTimeType;
    absenceType: AbsenceType;
    attendee: Attendee;
}
