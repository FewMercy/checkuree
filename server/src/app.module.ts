import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getOrmConfig } from './common/const/orm.config';
import { User } from './users/entities/user.entity';
import { Attendance } from './attendances/entities/attendance.entity';
import { AttendancesModule } from './attendances/attendances.module';
import { UserAttendance } from './attendances/entities/user-attendance.entity';
import { AttendeesModule } from './attendees/attendees.module';
import { SchedulesModule } from './schedules/schedules.module';
import { Schedule } from './schedules/entities/schedule.entity';
import { RecordsModule } from './records/records.module';
import { Record } from './records/entities/record.entity';
import { ConfigModule } from '@nestjs/config';
import { InvitationsModule } from './invitations/invitations.module';
import { Invitation } from './invitations/entities/invitation.entity';
import { LoginHistory } from './auth/entity/login-history.entity';
import { FileManagerModule } from './file-manager/file-manager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
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
export class AppModule {}
