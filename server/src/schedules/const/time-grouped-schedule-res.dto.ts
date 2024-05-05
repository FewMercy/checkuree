import { Schedule } from '../entities/schedule.entity';

export class TimeGroupedScheduleResDto {
  [key: string]: Schedule[];

  constructor(schedules: Schedule[]) {
    schedules.forEach((schedule) => {
      const { time } = schedule;
      this[time] = this[time] || []; // 이전에 이 시간에 대한 배열이 없다면 새 배열을 초기화
      this[time].push(schedule);
    });
  }
}
