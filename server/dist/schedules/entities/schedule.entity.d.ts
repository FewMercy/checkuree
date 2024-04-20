import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { Attendee } from '../../attendees/entities/attendee.entity';
import { DayType } from '../const/day-type.enum';
export declare class Schedule extends BaseTimeEntity {
    id: number;
    attendeeId: string;
    day: DayType;
    time: string;
    attendee: Attendee;
}
