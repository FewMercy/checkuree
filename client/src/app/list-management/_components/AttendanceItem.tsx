'use client';

import React from 'react';

// Styles
import { Colors, Icons } from '@/styles/globalStyles';
import { AttendanceItemContainer } from '@/styles/app/listManagement.styles';

// Components
import Icon from '@/components/Icon';

// Types
import { AttendanceData } from '@/api/attendances/schema';

interface ItemType extends AttendanceData {
    status: string;
    isDetailOpen: boolean;
}

interface PropsType {
    index: number;
    item: any;
    handleListItem: (
        index: number,
        field: string,
        value: string | boolean
    ) => void;
}

const AttendanceItem = (props: PropsType) => {
    const { item, index, handleListItem } = props;

    const statusIcons: { icon: string; count: number }[] = [
        { icon: 'sentiment_satisfied_alt', count: 10 },
        { icon: 'watch_later', count: 1 },
        { icon: 'highlight_off', count: 1 },
    ];

    return (
        <AttendanceItemContainer
            status={item.status}
            isDetailOpen={item.isDetailOpen}
            key={`attendance-item__${item.id}`}
        >
            <div className={'attendance-item__container'}>
                <div className="name">{item.name}</div>

                <div className={'bottom-container'}>
                    <div className={'days'}>월, 금</div>
                    <div className={'status-container'}>
                        {statusIcons.map((item) => (
                            <div className="status">
                                <Icon
                                    icon={Icons[item.icon]}
                                    color={Colors.Gray80}
                                    size={16}
                                />
                                <div className="count">{item.count}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AttendanceItemContainer>
    );
};

export default AttendanceItem;
