import { CreateAttendeeDto } from './create-attendee.dto';
declare const UpdateAttendeeDto_base: import("@nestjs/common").Type<Partial<CreateAttendeeDto>>;
export declare class UpdateAttendeeDto extends UpdateAttendeeDto_base {
    updateId: string;
    updatedAt: Date;
}
export {};
