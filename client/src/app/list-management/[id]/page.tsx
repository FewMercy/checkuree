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
import AttendanceItem from '@/app/list-management/_components/AttendanceItem';
import FormContents from '@/app/list-management/_components/FormContents';

// Types
import { AttendanceData, AttendeeData } from '@/api/attendances/schema';

const ListManagement = () => {
    const attendanceId = usePathname().split('/')[2];

    const [attendeeList, setAttendeeList] = useState<AttendeeData[]>([]);
    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

    // 출석대상 명단 조회
    const { data = [], isSuccess } = useQuery({
        queryKey: ['attendee-list'],
        queryFn: async (): Promise<AttendeeData[]> => {
            const response =
                await AttendanceApiClient.getInstance().getAttendeeList(
                    attendanceId
                );

            if (response.status === 200 && _.has(response.data, 'items')) {
                return response.data.items.map((item) => ({
                    ...item,
                    status: '',
                    isDetailOpen: false,
                }));
            }
            return response.data.items;
        },
    });

    // 출석부 상세 조회
    const { data: attendanceDetail = {} as AttendanceData } = useQuery({
        queryKey: ['attendance-detail'],
        queryFn: async (): Promise<AttendanceData> => {
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

            return {} as AttendanceData;
        },
    });

    // 출석 기록 summary 조회
    const { data: attendanceSummary } = useQuery({
        queryKey: ['attendance-summary'],
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
        enabled: data && isSuccess,
    });

    console.log('attendanceSummary', attendanceSummary);

    /**
     * @description 출석/지각/결석 선택 및 상세사유 입력 등 출석대상 목록의 값을 변경하는 함수
     */
    const handleListItem = (
        index: number,
        field: string,
        value: string | boolean
    ) => {
        setAttendeeList((prevState) => {
            return prevState.map((item, idx) => {
                if (idx === index)
                    return Object.assign(item, { [field]: value });
                else return item;
            });
        });
    };

    useEffect(() => {
        if (data && Array.isArray(data) && data?.length > 0) {
            setAttendeeList(data);
        }
    }, [data]);

    return (
        <ListManagementContainer>
            <section className="attendance-header">
                <div className="attendance-img"></div>

                <section className="attendance-info">
                    <div className="name">{attendanceDetail.title}</div>
                </section>
            </section>

            {/* 출석부 명단 */}
            <section className="attendance-list">
                {attendeeList &&
                    attendanceSummary &&
                    attendeeList.map((item, index) => (
                        <AttendanceItem
                            item={{ ...item, ...attendanceSummary[index] }}
                        />
                    ))}
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
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                children={
                    <FormContents
                        data={attendanceDetail}
                        attendanceId={attendanceId}
                        onClose={() => setIsAddOpen(false)}
                    />
                }
            />
        </ListManagementContainer>
    );
};

export default ListManagement;
