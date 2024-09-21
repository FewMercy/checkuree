import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Attendee } from '../entities/attendee.entity';
import { INVALID_MOBILENUMBER_MESSAGE } from '../../auth/const/error-message';
import { MobileNumberTransform } from '../../common/decorator/phoneNumber.decorator';
import { AttendeeGrade } from '../const/grade.enum';
import { Gender } from '../const/gender.enum';

export class CreateAttendeeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '출석부 ID',
    type: 'string',
    example: 'attendanceId',
  })
  attendanceId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '출석 대상 이름',
    type: 'string',
    example: 'attendee name',
  })
  name: string;

  @IsEnum(Gender)
  @ApiProperty({
    description: '출석 대상 성별 ( MALE / FEMALE )',
    type: 'string',
    example: 'MALE',
  })
  gender: Gender;

  @IsString()
  @Matches(/^01[01]{1}\d{7,8}$/, {
    message: INVALID_MOBILENUMBER_MESSAGE,
  })
  @MobileNumberTransform()
  @IsOptional()
  @ApiPropertyOptional({
    description: '출석 대상 전화번호',
    type: 'string',
    example: '01012345678',
  })
  mobileNumber: string;

  @IsString()
  @Matches(/^01[01]{1}\d{7,8}$/, {
    message: INVALID_MOBILENUMBER_MESSAGE,
  })
  @MobileNumberTransform()
  @IsOptional()
  @ApiPropertyOptional({
    description: '출석 대상 비상 전화번호',
    type: 'string',
    example: '01012345678',
  })
  subMobileNumber: string;

  @IsString()
  @Matches(/^\d{4}-[01][0-9]-[0-3][0-9]$/, { message: '생년월일이 올바르지 않습니다.' })
  @IsOptional()
  @ApiPropertyOptional({
    description: '출석 대상 생년월일',
    type: 'string',
    example: '2000',
  })
  birth?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: '출석 대상 과정',
    type: 'string',
    example: '바이엘 1',
  })
  course?: string;

  @IsEnum(AttendeeGrade)
  @IsOptional()
  @ApiPropertyOptional({
    description: '출석 대상 학년',
    type: 'enum',
    enum: AttendeeGrade,
    example: AttendeeGrade.ELEMENTARY_1,
  })
  grade?: AttendeeGrade;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: '출석 대상 학교',
    type: 'string',
    example: '장로회 신학 대학교',
  })
  school?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '출석 대상 설명',
    type: 'string',
    example: 'attendee description',
  })
  description: string;

  createId: string;

  createdAt: string;

  toEntity() {
    const attendee = new Attendee();
    attendee.name = this.name;
    attendee.gender = this.gender;
    attendee.attendanceId = this.attendanceId;
    attendee.mobileNumber = this.mobileNumber;
    attendee.subMobileNumber = this.subMobileNumber;
    attendee.description = this?.description;
    attendee.birth = this?.birth;
    attendee.course = this?.course;
    attendee.grade = this?.grade;
    attendee.school = this?.school;
    return attendee;
  }
}
