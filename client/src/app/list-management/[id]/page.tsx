'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import _ from 'lodash';

// Styles
import { Colors, Icons } from '@/styles/globalStyles';
import { ListManagementContainer } from '@/styles/app/listManagement.styles';

// Api
import { useQuery } from '@tanstack/react-query';
import AttendanceApiClient from '@/api/attendances/AttendanceApiClient';

// Components
import { Fab } from '@mui/material';
import Icon from '@/components/Icon';
import BottomDrawer from '@/components/BottomDrawer';
import AttendanceItem from '@/app/list-management/[id]/_components/AttendanceItem';
import FormContents from '@/app/list-management/[id]/_components/FormContents';

// Types
import { Attendance, AttendeeData } from '@/api/attendances/schema';
import Image from 'next/image';

const ListManagement = () => {
    const attendanceId = usePathname().split('/')[2];

    const [attendeeList, setAttendeeList] = useState<AttendeeData[]>([]);
    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState<string>('');

    // 출석대상 명단 조회
    const { data = [], isSuccess } = useQuery({
        queryKey: ['attendee-list', attendanceId],
        queryFn: async (): Promise<AttendeeData[]> => {
            const response =
                await AttendanceApiClient.getInstance().getAttendeeList(
                    attendanceId
                );

            if (response.status === 200 && _.has(response.data, 'items')) {
                return (response.data.items || []).map((item) => ({
                    ...item,
                    status: '',
                    isDetailOpen: false,
                }));
            }

            return [] as AttendeeData[];
        },
    });

    // 출석부 상세 조회
    const { data: attendanceDetail = {} as Attendance } = useQuery({
        queryKey: ['attendance-detail', attendanceId],
        queryFn: async (): Promise<Attendance> => {
            const response =
                await AttendanceApiClient.getInstance().getAttendanceDetail(
                    attendanceId
                );

            if (
                response.status === 200 &&
                _.has(response, 'data') &&
                _.has(response.data, 'data')
            ) {
                return response.data.data;
            }

            return {} as Attendance;
        },
    });

    // 출석 기록 summary 조회
    const { data: attendanceSummary } = useQuery({
        queryKey: ['attendance-summary', attendanceId],
        queryFn: async () => {
            const attendeeIds = data.map((item) => item.id);
            const response =
                await AttendanceApiClient.getInstance().getAttendanceSummary(
                    attendanceId,
                    attendeeIds
                );

            if (response.status === 200 && _.has(response, 'data')) {
                return response.data;
            }

            return [];
        },
        enabled: data && data?.length > 0 && isSuccess,
    });

    const onCloseModal = () => {
        if (isAddOpen) {
            setIsAddOpen(false);
            return;
        }

        setIsUpdateOpen('');
    };

    useEffect(() => {
        if (data && Array.isArray(data) && data?.length > 0) {
            setAttendeeList(data);
        }
    }, [data]);

    return (
        <ListManagementContainer>
            <section className="attendance-header">
                <div className="attendance-img">
                    {attendanceDetail.imageUrl ? (
                        <Image
                            src={attendanceDetail.imageUrl}
                            alt="attendance-image"
                            width={32}
                            height={32}
                        />
                    ) : null}
                </div>

                <section className="attendance-info">
                    <div className="name">{attendanceDetail.title}</div>
                </section>
            </section>

            {/* 출석부 명단 */}
            <section className="attendance-list">
                {attendeeList && attendeeList.length > 0
                    ? attendanceSummary &&
                      attendeeList.map((item, index) => (
                          <AttendanceItem
                              item={{ ...item, ...attendanceSummary[index] }}
                              setIsUpdateOpen={setIsUpdateOpen}
                              key={`attendance-item__${item.id}`}
                          />
                      ))
                    : '출석 대상이 없습니다.'}
            </section>

            {/* 등록 버튼 */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={() => setIsAddOpen(true)}
            >
                <Icon icon={Icons.add} size={32} color={Colors.White} />
            </Fab>

            {/* 등록/변경 모달 */}
            <BottomDrawer
                open={isAddOpen || isUpdateOpen.length > 0}
                onClose={onCloseModal}
                children={
                    <FormContents
                        data={attendanceDetail}
                        attendeeId={isUpdateOpen}
                        attendanceId={attendanceId}
                        onClose={onCloseModal}
                    />
                }
            />
        </ListManagementContainer>
    );
};

export default ListManagement;
