import { DayType } from '../const/day-type.enum';
import { Pagination } from '../../common/response/pagination';
export declare class ScheduleFilterDto extends Pagination {
    days?: DayType[];
    timeFrom?: string;
    timeTo?: string;
}
