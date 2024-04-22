'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

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
import { AttendanceData } from '@/api/attendances/schema';

interface AttendanceItem extends AttendanceData {
    status: string;
    isDetailOpen: boolean;
}

const ListManagement = () => {
    const attendanceId = usePathname().split('/')[2];

    const [attendeeList, setAttendeeList] = useState<AttendanceItem[]>([]);
    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

    // fetching API
    const { data, isLoading } = useQuery({
        queryKey: ['attendance-detail'],
        queryFn: async () => {
            const response =
                await AttendanceApiClient.getInstance().getAttendanceDetail(
                    attendanceId
                );

            if (response.status === 200) {
                return response.data.items.map((item) => ({
                    ...item,
                    status: '',
                    isDetailOpen: false,
                }));
            }
            return response.data;
        },
    });

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
                    {/* TODO: 추후 데이터 제대로 내려오면 api 값으로 변경 필요 */}
                    <div className="name">출석부 이름</div>
                </section>
            </section>

            {/* 출석부 명단 */}
            <section className="attendance-list">
                {attendeeList &&
                    attendeeList.map((item, index) => (
                        <AttendanceItem
                            item={item}
                            index={index}
                            handleListItem={handleListItem}
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
                        data={{ ...attendeeList, days: ['MONDAY'] }}
                        onClose={() => setIsAddOpen(false)}
                    />
                }
            />
        </ListManagementContainer>
    );
};

export default ListManagement;
