import { DayType } from '../const/day-type.enum';
export declare class ScheduleFilterDto {
    days?: DayType[];
    timeFrom?: string;
    timeTo?: string;
}
