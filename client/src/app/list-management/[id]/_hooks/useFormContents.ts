import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AttendanceApiClient from '@/api/attendances/AttendanceApiClient';

import { UseFormWatch } from 'react-hook-form';
import { Inputs } from '@/app/list-management/[id]/_components/FormContents';

import {
    AttendeeData,
    CreateAttendee,
    CreateSchedules,
    DeleteAttendees,
    SingleSchedulesType,
} from '@/api/attendances/schema';
import _ from 'lodash';

interface PropsType {
    watch: UseFormWatch<Inputs>;
    attendeeId?: string;
    attendanceId: string;
    onClose: () => void;
}

const useFormContents = (props: PropsType) => {
    const { watch, attendeeId, attendanceId, onClose } = props;

    const queryClient = useQueryClient();

    /** 수정 대상의 정보 */
    const { data: attendeeDetail, isSuccess } = useQuery({
        queryKey: ['attendee-detail', attendeeId],
        queryFn: async (): Promise<AttendeeData> => {
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

            return {} as AttendeeData;
        },
        enabled: attendeeId ? attendeeId.length > 0 : false,
    });

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
            const selectedSchedules = watch('times');
            const singleSchedulesList: SingleSchedulesType = [];

            Object.keys(selectedSchedules || {}).forEach((day) => {
                const times = selectedSchedules[day];

                times.forEach((time) => {
                    singleSchedulesList.push({ day, time });
                });
            });

            if (
                selectedSchedules === undefined ||
                !singleSchedulesList.length
            ) {
                await queryClient.invalidateQueries({
                    queryKey: ['attendee-list'],
                });
                await queryClient.invalidateQueries({
                    queryKey: ['attendee-detail'],
                });
                onClose();
                return;
            }

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
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['attendee-list'],
                }),
                queryClient.invalidateQueries({
                    queryKey: ['attendee-detail'],
                }),
            ]);
            onClose();
        },
    });

    /** 출석대상 삭제 */
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

    // 30분 간격으로 시간을 생성하는 함수
    function generateTimeOptions() {
        const options = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeLabel = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const timeValue = (hour * 100 + minute)
                    .toString()
                    .padStart(4, '0');
                options.push({ label: timeLabel, value: timeValue });
            }
        }
        return options;
    }

    return {
        attendeeDetail,
        isSuccess,
        createAttendee,
        updateAttendee,
        deleteAttendees,
        generateTimeOptions,
    };
};

export default useFormContents;
