'use client';

import React, { useEffect, useState } from 'react';

// Libraries
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Components
import {
    FormControl,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Modal,
} from '@mui/material';

// Utils
import { dateFormat } from '@/utils';

// Styles
import { Colors, Icons } from '@/styles/globalStyles';
import {
    CalendarContainer,
    FormContentsContainer,
} from '@/styles/app/listManagement.styles';
import {
    AttendanceData,
    AttendanceDetail,
    AttendeeData,
    AttendeeDetail,
    CreateAttendee,
    CreateSchedules,
    DeleteAttendees,
    SingleSchedulesType,
} from '@/api/attendances/schema';
import Icon from '@/components/Icon';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AttendanceApiClient from '@/api/attendances/AttendanceApiClient';
import useFormContents from '@/app/list-management/_hooks/useFormContents';

// Types
interface Inputs {
    name: string;
    gender: string;
    birth: string;
    mobileNumber: string;
    subMobileNumber: string;
    times: Record<string, string[]>;
}

const FormContents = ({
    data,
    attendeeId,
    attendanceId,
    onClose,
}: {
    data: AttendanceData;
    attendeeId?: string;
    attendanceId: string;
    onClose: () => void;
}) => {
    const queryClient = useQueryClient();

    const [selectedDay, setSelectedDay] = useState<string>(data?.days[0] || '');
    const [timeOptions, setTimeOptions] = useState<
        { label: string; value: string }[]
    >([]);
    const [showCalendar, setShowCalendar] = useState(false);

    const { generateTimeOptions } = useFormContents();

    const { data: attendeeDetail, isSuccess } = useQuery({
        queryKey: ['attendee-detail', attendeeId],
        queryFn: async () => {
            const response =
                await AttendanceApiClient.getInstance().getAttendeeDetail(
                    attendeeId || ''
                );

            if (
                response.status === 200 &&
                _.has(response, 'data') &&
                _.has(response.data, 'data')
            ) {
                return response.data.data;
            }

            return {};
        },
        enabled: attendeeId ? attendeeId.length > 0 : false,
    });

    const {
        watch,
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: { gender: 'MALE' },
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    });

    const onSubmit = handleSubmit((data) => {
        // TODO: times 정보는 schedule로 보내야 함.
        const { times, subMobileNumber, ...rest } = data;

        if (attendanceId) {
            if (attendeeId) {
                updateAttendee({
                    attendeeId: attendeeId,
                    parameters: { ...rest, attendanceId },
                });
            } else {
                createAttendee({ ...rest, attendanceId });
            }
        }
    });

    const days: Record<string, string> = {
        MONDAY: '월',
        TUESDAY: '화',
        WEDNESDAY: '수',
        THURSDAY: '목',
        FRIDAY: '금',
        SATURDAY: '토',
        SUNDAY: '일',
    };

    /** 출석대상 생성 */
    const { mutate: createAttendee } = useMutation({
        mutationFn: async (parameters: CreateAttendee) => {
            const response =
                await AttendanceApiClient.getInstance().createAttendee(
                    parameters
                );
            return response.data;
        },
        onSuccess: async (data) => {
            const selectedSchedules = watch('times');
            const singleSchedulesList: SingleSchedulesType = [];

            Object.keys(selectedSchedules).forEach((day) => {
                const times = selectedSchedules[day];

                times.forEach((time) => {
                    singleSchedulesList.push({ day, time });
                });
            });
            mutateSchedules({
                attendanceId,
                attendeeId: data.data.id,
                singleSchedules: singleSchedulesList,
            });
        },
    });

    /** 출석대상 정보 수정 */
    const { mutate: updateAttendee } = useMutation({
        mutationFn: async (props: {
            attendeeId: string;
            parameters: CreateAttendee;
        }) => {
            const { attendeeId, parameters } = props;

            const response =
                await AttendanceApiClient.getInstance().updateAttendee(
                    attendeeId,
                    parameters
                );
            return response.data;
        },
        onSuccess: async (data) => {
            // TODO: 스케쥴 수정 api 연동
            const selectedSchedules = watch('times');
            const singleSchedulesList: SingleSchedulesType = [];

            Object.keys(selectedSchedules).forEach((day) => {
                const times = selectedSchedules[day];

                times.forEach((time) => {
                    singleSchedulesList.push({ day, time });
                });
            });
            mutateSchedules({
                attendanceId,
                attendeeId: data.data.id,
                singleSchedules: singleSchedulesList,
            });
        },
    });

    /** 출석대상의 스케쥴 생성 */
    const { mutate: mutateSchedules } = useMutation({
        mutationFn: async (parameters: CreateSchedules) => {
            const response =
                await AttendanceApiClient.getInstance().createSchedules(
                    parameters
                );
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['attendee-list'],
            });
            onClose();
        },
    });

    const handleSelectTime = (day: string, time: string) => {
        const updatedTimes = watch('times') || {};

        const index = _.has(updatedTimes, day)
            ? updatedTimes[day].indexOf(time)
            : -1;
        if (index !== -1) {
            updatedTimes[day].splice(index, 1);
        } else {
            if (!_.has(updatedTimes, day)) {
                Object.assign(updatedTimes, { [day]: [] });
            }
            updatedTimes[day].push(time);
        }
        setValue('times', updatedTimes);
    };

    const { mutate: deleteAttendees } = useMutation({
        mutationKey: ['deleteAttendees'],
        mutationFn: async (parameters: DeleteAttendees) =>
            AttendanceApiClient.getInstance().deleteAttendees(parameters),
        onSuccess: async () => {
            onClose();
            await queryClient.invalidateQueries({
                queryKey: ['attendee-list'],
            });
        },
    });

    useEffect(() => {
        if (isSuccess && attendeeDetail) {
            reset(attendeeDetail);
        }
    }, [isSuccess, attendeeDetail]);

    useEffect(() => {
        if (data && data?.availableFrom && data?.availableTo) {
            const fromMinutes =
                parseInt(data.availableFrom.substring(0, 2)) * 60 +
                parseInt(data.availableFrom.substring(2));
            const toMinutes =
                parseInt(data.availableTo.substring(0, 2)) * 60 +
                parseInt(data.availableTo.substring(2));

            // 생성된 시간 중에서 from에서 to까지의 범위에 해당하는 시간들을 필터링
            const timeOptions = generateTimeOptions().filter((option) => {
                const currentTimeInMinutes =
                    parseInt(option.value.substring(0, 2)) * 60 +
                    parseInt(option.value.substring(2));
                return (
                    currentTimeInMinutes >= fromMinutes &&
                    currentTimeInMinutes <= toMinutes
                );
            });

            setTimeOptions(timeOptions);
        }

        if (data && data.days) {
            let initialDays = {};
            data.days.forEach((day) => {
                Object.assign(initialDays, { [day]: [] });
            });
            setValue('times', initialDays);
        }
    }, [data]);

    return (
        <FormContentsContainer gender={watch('gender')}>
            <form id="create-attendees" onSubmit={onSubmit}>
                <div className="form-row">
                    <div className="label">이름</div>
                    <div className="value">
                        <TextField {...register('name')} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="label">성별</div>
                    <div className="value">
                        <FormControl>
                            <RadioGroup
                                defaultValue="MALE"
                                aria-labelledby="gender-radio-buttons-group-label"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel
                                    value="MALE"
                                    control={
                                        <Radio
                                            {...register('gender')}
                                            checked={watch('gender') === 'MALE'}
                                            sx={{
                                                color:
                                                    watch('gender') === 'MALE'
                                                        ? Colors.CheckureeGreen
                                                        : Colors.Gray60,
                                                '&.Mui-checked': {
                                                    color:
                                                        watch('gender') ===
                                                        'MALE'
                                                            ? Colors.CheckureeGreen
                                                            : Colors.Gray60,
                                                },
                                                '&.MuiFormControlLabel-label': {
                                                    color: Colors.Gray60,
                                                },
                                            }}
                                        />
                                    }
                                    label="남"
                                />
                                <FormControlLabel
                                    value="FEMALE"
                                    control={
                                        <Radio
                                            {...register('gender')}
                                            checked={
                                                watch('gender') === 'FEMALE'
                                            }
                                            sx={{
                                                color:
                                                    watch('gender') === 'FEMALE'
                                                        ? Colors.CheckureeGreen
                                                        : Colors.Gray60,
                                                '&.Mui-checked': {
                                                    color:
                                                        watch('gender') ===
                                                        'FEMALE'
                                                            ? Colors.CheckureeGreen
                                                            : Colors.Gray60,
                                                },
                                                '&.MuiFormControlLabel-label': {
                                                    color: Colors.Gray60,
                                                },
                                            }}
                                        />
                                    }
                                    label="녀"
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>

                <div className="form-row">
                    <div className="label">생년월일</div>
                    <div className="value">
                        <div
                            className="calendar-input"
                            onClick={() => setShowCalendar(true)}
                        >
                            {watch('birth') ? (
                                dateFormat(new Date(watch('birth')), 'slash')
                            ) : (
                                <span>YYYY/MM/DD</span>
                            )}
                        </div>
                        <Modal
                            open={showCalendar}
                            onClose={() => setShowCalendar(false)}
                        >
                            <CalendarContainer>
                                <Calendar
                                    value={watch('birth')}
                                    onChange={(date) => {
                                        if (date && date instanceof Date) {
                                            setValue(
                                                'birth',
                                                dateFormat(date, 'dash')
                                            );
                                        }
                                        setShowCalendar(false);
                                    }}
                                />
                            </CalendarContainer>
                        </Modal>
                    </div>
                </div>

                <div className="form-row">
                    <div className="label">핸드폰 번호</div>
                    <div className="value">
                        <TextField {...register('mobileNumber')} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="label">보호자 핸드폰 번호</div>
                    <div className="value">
                        <TextField {...register('subMobileNumber')} />
                    </div>
                </div>

                {/* TODO: 수정하는 경우 -> 기존 스케쥴 값 연동 필요 */}
                <div className="days-times-container">
                    <div className="days-container">
                        {data?.days.map((day) => (
                            <div
                                className={`day ${selectedDay === day ? 'selected' : ''}`}
                                onClick={() => setSelectedDay(day)}
                            >
                                {days[day]}
                            </div>
                        ))}
                    </div>
                    <div className="time-container">
                        <div className="selected-times">
                            {watch('times') &&
                                _.has(watch('times'), selectedDay) &&
                                watch('times')[selectedDay].map((item) => (
                                    <div className="selected-time">
                                        {`${item.slice(0, 2)}:${item.slice(2)}`}
                                        <Icon
                                            icon={Icons.highlight_off}
                                            size={20}
                                            color={Colors.CheckureeGreen}
                                            onClick={() =>
                                                handleSelectTime(
                                                    selectedDay,
                                                    item
                                                )
                                            }
                                        />
                                    </div>
                                ))}
                        </div>
                        <div className="time-options">
                            {timeOptions.map((item) => {
                                const isSelected =
                                    watch('times') &&
                                    _.has(watch('times'), selectedDay) &&
                                    watch('times')[selectedDay].includes(
                                        item.value
                                    );

                                return (
                                    <div
                                        className={`time-option ${isSelected ? 'selected' : ''}`}
                                        onClick={() =>
                                            handleSelectTime(
                                                selectedDay,
                                                item.value
                                            )
                                        }
                                    >
                                        {item.label}
                                        <Icon
                                            icon={
                                                Icons[
                                                    isSelected
                                                        ? 'check_circle'
                                                        : 'radio_button_unchecked'
                                                ]
                                            }
                                            size={20}
                                            color={
                                                isSelected
                                                    ? Colors.CheckureeGreen
                                                    : Colors.Gray60
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </form>

            <section className="additional-button-container">
                <div className="additional-button">전체 스케줄보기</div>
                <div className="additional-button">출석 히스토리</div>
            </section>

            <div
                className="disabled-button"
                onClick={() => {
                    if (confirm('출석대상을 삭제하시겠습니까?'))
                        deleteAttendees({
                            ids: attendeeId ? [attendeeId] : [''],
                            attendanceId: attendanceId,
                        });
                }}
            >
                비활성화
            </div>

            <section className="button-container">
                <div className="button cancel" onClick={onClose}>
                    취소
                </div>
                <button
                    type="submit"
                    className="button confirm"
                    form="create-attendees"
                >
                    저장
                </button>
            </section>
        </FormContentsContainer>
    );
};

export default FormContents;
