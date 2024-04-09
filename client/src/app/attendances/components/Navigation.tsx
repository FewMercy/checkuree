// JavaScript
import { Box, Typography, styled } from '@mui/material';
import React, { SetStateAction, useState } from 'react';

import { AttendanceItemType } from '../[id]/page';
import Image from 'next/image';

interface Menu {
    name: string;
    icon: string;
    iconActivate: string;
    label: string;
}

interface Iprops {
    status: boolean;
    setDummyList: React.Dispatch<SetStateAction<AttendanceItemType[]>>;
}

const menus: Menu[] = [
    {
        name: 'attendance',
        icon: '/images/icons/check-icon.svg',
        iconActivate: '/images/icons/check-activate-icon.svg',
        label: '출석 체크',
    },
    {
        name: 'statistics',
        icon: '/images/icons/statistics-icon.svg',
        iconActivate: '/images/icons/statistics-activate-icon.svg',
        label: '출석 통계',
    },
    {
        name: 'management',
        icon: '/images/icons/list-icon.svg',
        iconActivate: '/images/icons/list-activate-icon.svg',
        label: '명단 관리',
    },
    {
        name: 'settings',
        icon: '/images/icons/setting-icon.svg',
        iconActivate: '/images/icons/setting-activate-icon.svg',
        label: '출석부 설정',
    },
];

const Navigation = (props: Iprops) => {
    const { status, setDummyList } = props;
    const [activeMenu, setActiveMenu] = useState<string>('attendance');

    const handleMenuClick = (menuName: string) => {
        setActiveMenu(menuName);
    };

    const resetAllStatus = () => {
        setDummyList((prevState) =>
            prevState.map((item) => ({
                ...item,
                status: '', // 모든 요소의 status 값을 ''로 설정
            }))
        );
    };

    return (
        <>
            {status ? (
                <BoxSTNavigationActivate>
                    <BoxSTCancel onClick={() => resetAllStatus()}>
                        취소
                    </BoxSTCancel>
                    <BoxSTConfirm sx={{}}>저장</BoxSTConfirm>
                </BoxSTNavigationActivate>
            ) : (
                <BoxSTNavigation>
                    {menus.map((menu, index) => (
                        <BoxSTMenu
                            key={menu.name}
                            onClick={() => handleMenuClick(menu.name)}
                        >
                            {activeMenu === menu.name ? (
                                <Image
                                    src={'/images/icons/eclipse-icon.svg'}
                                    alt={''}
                                    width={60}
                                    height={60}
                                    style={{
                                        position: 'absolute',
                                        zIndex: 0,
                                    }}
                                />
                            ) : null}
                            <Box
                                sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '7px',
                                }}
                            >
                                <Image
                                    key={index}
                                    src={
                                        activeMenu === menu.name
                                            ? menu.iconActivate
                                            : menu.icon
                                    }
                                    alt={menu.label}
                                    width={19}
                                    height={16.5}
                                />
                                <Typography fontSize={12} color={'white'}>
                                    {menu.label}
                                </Typography>
                            </Box>
                        </BoxSTMenu>
                    ))}
                </BoxSTNavigation>
            )}
        </>
    );
};

export default Navigation;

const BoxSTNavigation = styled(Box)(() => {
    return {
        width: '359px',
        height: '60px',
        backgroundColor: '#59996B',
        borderRadius: '30px',
        display: 'flex',
        boxShadow: '0px 2px 10px 4px rgba(0, 0, 0, 0.25)',
        alignItems: 'center',
        justifyContent: 'space-around',
        position: 'fixed',
        bottom: '0',
        zIndex: '9999',
        left: '50%',
        top: '90%',
        transform: 'translateX(-50%)',
    };
});

const BoxSTMenu = styled(Box)(() => {
    return {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '60px',
        width: '60px',
    };
});

const BoxSTNavigationActivate = styled(Box)(() => {
    return {
        width: '359px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        position: 'fixed',
        bottom: '0',
        zIndex: '9999',
        left: '50%',
        top: '90%',
        transform: 'translateX(-50%)',
    };
});

const BoxSTConfirm = styled(Box)(() => {
    return {
        width: '247px',
        height: '60px',
        borderRadius: '30px',
        backgroundColor: '#59996B',
        color: 'white',
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: '21.79px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0px 2px 10px 4px rgba(0, 0, 0, 0.25)',
    };
});

const BoxSTCancel = styled(Box)(() => {
    return {
        width: '102px',
        height: '60px',
        borderRadius: '30px',
        color: '#59996B',
        background: 'white',
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: '21.79px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0px 2px 10px 4px rgba(0, 0, 0, 0.25)',
    };
});
