import { Attendee } from '../../../src/attendees/entities/attendee.entity';
import { Gender } from '../../../src/attendees/const/gender.enum';

/**
 * Gender = MALE 인 Attendee 를 생성합니다.
 */
export function createAttendee(name: string, attendanceId: string, description: string, createId: string) {
  const attendee = new Attendee();
  attendee.name = name;
  attendee.gender = Gender.MALE;
  attendee.attendanceId = attendanceId;
  attendee.description = description;
  attendee.createId = createId;
  return attendee;
}
