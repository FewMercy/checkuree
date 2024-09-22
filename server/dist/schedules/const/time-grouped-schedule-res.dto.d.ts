import { Schedule } from '../entities/schedule.entity';
export declare class TimeGroupedScheduleResDto {
    [key: string]: Schedule[];
    constructor(schedules: Schedule[]);
}
