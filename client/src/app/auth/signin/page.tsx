'use client';

//Api
import AuthApiClient, { LoginData } from '@/api/AuthApiClient';
import {
    Box,
    Checkbox,
    Container,
    TextField,
    Typography,
    styled,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import axios from 'axios';
import { setTokens } from '@/libs/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const Index = () => {
    const router = useRouter();
    const accessToken = Cookies.get('ACCESS_TOKEN');
    const [login, setLogin] = useState<LoginData>({
        username: '',
        password: '',
        isAutoLogin: false,
    });

    const fetchLogin = async (params: LoginData) => {
        try {
            const response =
                await AuthApiClient.getInstance().userLogin(params);

            const token = response.data.data!.accessToken;
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setTokens({
                accessToken: response.data.data!.accessToken,
                refreshToken: response.data.data!.refreshToken,
            });

            return response;
        } catch (error) {
            //
            // 오류 처리
            console.error('Error occurred during login:', error);
            throw error;
        }
    };

    const { mutate: loginMutation } = useMutation({
        mutationKey: ['user'],
        mutationFn: fetchLogin,
        onSuccess: () => {
            alert('로그인 되었습니다.');
            router.push('/attendances');
        },
        onError: () => {
            alert('아이디 및 비밀번호가 일치하지 않습니다.');
        },
    });

    // Hook
    const onChange = (field: keyof LoginData, value: string | boolean) => {
        setLogin((prevState) => ({
            ...prevState!,
            [field]: value,
        }));
    };

    useEffect(() => {
        if (accessToken) {
            axios.defaults.headers.common['Authorization'] =
                `Bearer ${accessToken}`;
        }
    }, []);

    return (
        <ContainerST>
            <StyledBoxST>
                <LoginTypographyST>
                    <Image
                        src={'/images/logos/checkuree_logo.svg'}
                        width={300}
                        height={50}
                        alt=""
                    />
                </LoginTypographyST>
                <Box
                    component="form"
                    display={'flex'}
                    flexDirection={'column'}
                    gap={'12px'}
                >
                    <TextField
                        value={login.username || ''}
                        placeholder="아이디를 입력해주세요."
                        onChange={(e) => onChange('username', e.target.value)}
                        inputProps={TextFiledInputProps}
                        sx={{
                            borderRadius: '8px',
                        }}
                    />
                    <TextField
                        type="password"
                        placeholder="비밀번호를 입력해주세요."
                        onChange={(e) => onChange('password', e.target.value)}
                        inputProps={TextFiledInputProps}
                    />
                </Box>
            </StyledBoxST>
            <BoxSTLoginCommon gap={'10px'}>
                <StyledLoginButton
                    onClick={() => {
                        loginMutation(login);
                    }}
                    backgroundcolor="#59996B"
                >
                    체쿠리 로그인
                </StyledLoginButton>
                <StyledKakaoLoginButton
                    onClick={() => {
                        router.push('https://checkuree.com/api/v1/auth/kakao');
                    }}
                    backgroundcolor=""
                >
                    카카오 로그인
                </StyledKakaoLoginButton>
            </BoxSTLoginCommon>

            <Image
                src={'/images/logos/checkuree_logo.svg'}
                width={100}
                height={100}
                alt=""
                style={{
                    position: 'absolute',
                    bottom: 0,
                }}
            />
        </ContainerST>
    );
};

export default Index;

const TextFiledInputProps = {
    style: {
        backgroundColor: 'white',
        padding: '0px',
        width: '306px',
        height: '40px',
        borderRadius: '8px',
        border: '0px',
        paddingLeft: '12px',
    },
};

// Container에 대한 스타일
const ContainerST = styled(Container)(() => {
    return {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        gap: '32px',
    };
});

// Box에 대한 스타일
const StyledBoxST = styled(Box)(() => {
    return {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '28px',
    };
});

// Typography에 대한 스타일
const LoginTypographyST = styled(Typography)(() => {
    return {
        fontWeight: 600,
        fontSize: '32px',
        lineHeight: '43.58px',
    };
});

// Checkbox에 대한 스타일
const StyledCheckbox = styled(Checkbox)(() => {
    return {
        padding: 0,
        border: 0,
        width: '14px',
        height: '14px',
        color: '#D9D9D9',
    };
});

const BoxSTLoginCommon = styled(Box)(() => {
    return {
        display: 'flex',
        flexDirection: 'column',
    };
});

// 카카오 및 네이버 로그인 버튼 스타일
const StyledLoginButton = styled(Box)(({
    backgroundcolor,
}: {
    backgroundcolor: string;
}) => {
    return {
        width: '313px',
        height: '39px',
        borderRadius: '20px',
        fontSize: '14px',
        lineHeight: '19.07px',
        fontWeight: 600,
        textTransform: 'none',
        display: 'flex',
        color: 'white',
        alignItems: 'center',
        cursor: 'pointer',
        justifyContent: 'center',
        background: backgroundcolor,
    };
});

// 카카오 로그인 버튼의 색상
const StyledKakaoLoginButton = styled(StyledLoginButton)(() => {
    return {
        color: 'black',
        backgroundColor: '#fddc3f',
    };
});

// 네이버 로그인 버튼의 색상
const StyledNaverLoginButton = styled(StyledLoginButton)(() => {
    return {
        color: 'white',
        backgroundColor: '#00bf19',
    };
});
