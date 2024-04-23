import { Record } from '../entities/record.entity';
import { SingleRecord } from '../const/singleRecord.class';
export declare class CreateRecordDto {
    attendanceId: string;
    singleRecords: SingleRecord[];
    createdAt: Date;
    toEntities(createId: string): Record[];
}
