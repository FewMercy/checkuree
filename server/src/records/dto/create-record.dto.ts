import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, validate, ValidateNested } from 'class-validator';
import { Record } from '../entities/record.entity';
import { SingleRecord } from '../const/singleRecord.class';
import { plainToInstance, Type } from 'class-transformer';

export class CreateRecordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '출석부 PK',
    type: 'string',
    example: 'uuid-1234-uuid',
  })
  attendanceId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleRecord)
  @ApiProperty({ description: '출석 기록', type: Array.of(SingleRecord) })
  singleRecords: SingleRecord[];

  createdAt: Date;

  toEntities(createId: string): Record[] {
    return this.singleRecords.map((singleRecord) => {
      // const errors = await validate(plainToInstance(SingleRecord, singleRecord));
      //
      // if (errors.length > 0) {
      //   throw new Error('Record 값이 올바르지 않습니다.');
      // }

      const record = new Record();
      record.status = singleRecord.status;
      record.date = singleRecord.date;
      record.day = singleRecord.day;
      record.etc = singleRecord?.etc;
      record.lateTime = singleRecord?.lateTime;
      record.absenceType = singleRecord?.absenceType;
      record.attendeeId = singleRecord.attendeeId;
      record.createId = createId;
      record.createdAt = new Date();
      return record;
    });
  }
}
