import { Schedule } from '../entities/schedule.entity';
import { SingleSchedule } from '../const/single-schedule.class';
export declare class CreateScheduleDto {
    attendanceId: string;
    attendeeId: string;
    singleSchedules: SingleSchedule[];
    toEntities(createId: string): Schedule[];
}
