import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { UserAttendance } from './entities/user-attendance.entity';
import { AttendanceDay } from './entities/attendance-day.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, UserAttendance, AttendanceDay])],
  controllers: [AttendancesController],
  providers: [AttendancesService],
})
export class AttendancesModule {}
