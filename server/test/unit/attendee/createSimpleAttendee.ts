import { Attendee } from '../../../src/attendees/entities/attendee.entity';
import { Gender } from '../../../src/attendees/const/gender.enum';

/**
 * name, attendanceId, createId 를 입력 받아 간단한 attendee 생성
 * gender = MALE 로 통일
 */
export function createSimpleAttendee(name: string, attendanceId: string, createId: string) {
  const attendee = new Attendee();
  attendee.name = name;
  attendee.attendanceId = attendanceId;
  attendee.createId = createId;
  attendee.gender = Gender.MALE;
  return attendee;
}
