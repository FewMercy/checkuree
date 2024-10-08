import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Attendance } from './attendances/entities/attendance.entity';
import { AttendancesModule } from './attendances/attendances.module';
import { UserAttendance } from './attendances/entities/user-attendance.entity';
import { Attendee } from './attendees/entities/attendee.entity';
import { AttendeesModule } from './attendees/attendees.module';
import { SchedulesModule } from './schedules/schedules.module';
import { Schedule } from './schedules/entities/schedule.entity';
import { Record } from './records/entities/record.entity';
import { RecordsModule } from './records/records.module';
import { ConfigModule } from '@nestjs/config';
import { getOrmConfig } from './common/const/orm.config';
import { Invitation } from './invitations/entities/invitation.entity';
import { InvitationsModule } from './invitations/invitations.module';
import { LoginHistory } from './auth/entity/login-history.entity';
import { FileManagerService } from './file-manager/file-manager.service';
import { FileManagerModule } from './file-manager/file-manager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.test`,
    }),
    TypeOrmModule.forRoot({
      ...getOrmConfig(),
      entities: [User, Attendance, UserAttendance, Schedule, Record, Invitation, LoginHistory],
    }),
    UsersModule,
    AuthModule,
    AttendancesModule,
    AttendeesModule,
    SchedulesModule,
    RecordsModule,
    InvitationsModule,
    FileManagerModule,
  ],
})
export class TestModule {}
