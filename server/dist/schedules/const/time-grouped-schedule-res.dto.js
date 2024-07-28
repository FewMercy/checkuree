"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeGroupedScheduleResDto = void 0;
class TimeGroupedScheduleResDto {
    constructor(schedules) {
        schedules.forEach((schedule) => {
            const { time } = schedule;
            this[time] = this[time] || [];
            this[time].push(schedule);
        });
    }
}
exports.TimeGroupedScheduleResDto = TimeGroupedScheduleResDto;
//# sourceMappingURL=time-grouped-schedule-res.dto.js.map