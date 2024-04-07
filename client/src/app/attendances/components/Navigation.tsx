'use client';

import { Box, Typography, styled } from '@mui/material';
import React, { useState } from 'react';

import Image from 'next/image';

interface Menu {
    name: string;
    icon: string;
    label: string;
}

const menus: Menu[] = [
    {
        name: 'attendance',
        icon: '/images/icons/statistics-icon.svg',
        label: '출석 체크',
    },
    {
        name: 'statistics',
        icon: '/images/icons/statistics-icon.svg',
        label: '출석 통계',
    },
    {
        name: 'management',
        icon: '/images/icons/list-icon.svg',
        label: '명단 관리',
    },
    {
        name: 'settings',
        icon: '/images/icons/setting-icon.svg',
        label: '출석부 설정',
    },
];

const Navigation = () => {
    const [activeMenu, setActiveMenu] = useState<string>('');

    const handleMenuClick = (menuName: string) => {
        setActiveMenu(menuName);
    };
    return (
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
                            src={menu.icon}
                            alt={menu.label}
                            width={19}
                            height={16.5}
                            style={{
                                zIndex: 99999,
                            }}
                        />
                        <Typography fontSize={12} color={'white'}>
                            {menu.label}
                        </Typography>
                    </Box>
                </BoxSTMenu>
            ))}
        </BoxSTNavigation>
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
        top: '90%',
        alignItems: 'center',
        justifyContent: 'space-around',
        position: 'fixed',
        bottom: '0',
        zIndex: '9999',
        left: '50%',
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
