import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { UserAttendance } from './entities/user-attendance.entity';
import { AttendanceDay } from './entities/attendance-day.entity';
import { FileManagerService } from '../file-manager/file-manager.service';
import { S3Service } from '../file-manager/s3.service';
import { ImageProcessorService } from '../file-manager/image-processor.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, UserAttendance, AttendanceDay])],
  controllers: [AttendancesController],
  providers: [AttendancesService, FileManagerService, S3Service, ImageProcessorService],
})
export class AttendancesModule {}
