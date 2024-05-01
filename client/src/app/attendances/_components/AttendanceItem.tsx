'use client';

import React from 'react';

// Next
import Image from 'next/image';

// Styles
import { Images } from '@/styles/globalStyles';
import {
    StatusButton,
    AttendanceItemContainer,
} from '@/styles/app/attendancesId.styles';

// Components
import DetailInputBox from '@/app/attendances/_components/DetailInputBox';

// Types
import { AttendanceSchedulesByDateItem } from '@/api/attendances/schema';
import { HandleListItemType } from '@/app/attendances/[id]/page';

interface PropsType {
    index: number;
    time: string;
    item: AttendanceSchedulesByDateItem;
    handleListItem: HandleListItemType;
}

const AttendanceItem = (props: PropsType) => {
    const { item, time, index, handleListItem } = props;

    const statusButtons: { label: string; value: string }[] = [
        { label: '출석', value: '출석' },
        { label: '지각', value: '지각' },
        { label: '결석', value: '결석' },
    ];

    return (
        <AttendanceItemContainer
            status={item.status || ''}
            isDetailOpen={item.isDetailOpen || false}
            key={`attendance-item__${item.id}`}
        >
            <div className={'attendance-item__container'}>
                <div className="name">
                    {item.attendee.name}
                    <Image
                        src={Images.DetailOpen}
                        alt={`open-detail__${item.attendee.name}`}
                        onClick={() =>
                            handleListItem(
                                index,
                                time,
                                'isDetailOpen',
                                !item.isDetailOpen
                            )
                        }
                    />
                </div>

                <div className="status-buttons">
                    {statusButtons.map((button) => (
                        <StatusButton
                            isSelected={item.status === button.value}
                            onClick={() =>
                                handleListItem(
                                    index,
                                    time,
                                    'status',
                                    button.value
                                )
                            }
                        >
                            {button.label}
                        </StatusButton>
                    ))}
                </div>
            </div>

            {/* 출석/지각/상세 사유 입력 박스 */}
            <DetailInputBox
                item={item}
                time={time}
                index={index}
                handleListItem={handleListItem}
            />
        </AttendanceItemContainer>
    );
};

export default AttendanceItem;
