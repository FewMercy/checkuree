'use client';

//Api
import AuthApiClient, { LoginData } from '@/api/AuthApiClient';
import {
    Box,
    Checkbox,
    Container,
    CssBaseline,
    TextField,
    Typography,
    styled,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import axios from 'axios';
import { setTokens } from '@/libs/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const Index = () => {
    const router = useRouter();

    const [mounted, setMounted] = useState<boolean>(false);
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
        setMounted(true);
    }, []);

    return (
        <ContainerST>
            <StyledBoxST>
                <LoginTypographyST>로그인</LoginTypographyST>
                {/* <Box
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
                </Box> */}
            </StyledBoxST>
            <BoxSTLoginCommon gap={'38px'}>
                {/* <BoxSTLoginCommon gap={'4px'}>
                    <BoxSTLoginMaintain>
                        <StyledCheckbox
                            inputProps={{
                                style: {
                                    padding: 0,
                                },
                            }}
                            onChange={(e) =>
                                onChange('isAutoLogin', e.target?.checked)
                            }
                        />
                        <StyledLoginMaintainTypography>
                            로그인 유지
                        </StyledLoginMaintainTypography>
                    </BoxSTLoginMaintain>

                    <BoxSTLoginCommon gap={'10px'}>
                        <BoxSTLogin
                            onClick={() => {
                                loginMutation(login);
                            }}
                        >
                            로그인 하기
                        </BoxSTLogin>
                        <Box
                            display={'flex'}
                            justifyContent={'space-between'}
                            padding={'0px 4px'}
                        >
                            <StyledLinkTypography
                                onClick={() => router.push('/auth/signup')}
                            >
                                회원가입
                            </StyledLinkTypography>
                            <StyledLinkTypography
                                onClick={() => alert('준비중인 기능입니다.')}
                            >
                                아이디/비밀번호 찾기
                            </StyledLinkTypography>
                        </Box>
                    </BoxSTLoginCommon>
                </BoxSTLoginCommon> */}
                <StyledKakaoLoginButton
                    onClick={() => {
                        alert('준비중인 기능입니다.');
                    }}
                >
                    카카오 로그인
                </StyledKakaoLoginButton>
                {/* <Box display={'flex'} justifyContent={'space-between'}>
                 
                    <StyledNaverLoginButton
                        onClick={() => {
                            alert('준비중인 기능입니다.');
                        }}
                    >
                        네이버 로그인
                    </StyledNaverLoginButton>
                </Box> */}
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
        height: '100vh',
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

// 회원가입 및 아이디/비밀번호 찾기 텍스트 스타일
const StyledLinkTypography = styled(Typography)(() => {
    return {
        cursor: 'pointer',
        fontSize: '14px',
        color: '#222222',
        lineHeight: '19.07px',
        fontWeight: 500,
    };
});

// 회원가입 및 아이디/비밀번호 찾기 텍스트 스타일
const StyledLoginMaintainTypography = styled(Typography)(() => {
    return {
        fontSize: '12.5px',
        color: '#D9D9D9',
        lineHeight: '16.34px',
        fontWeight: 500,
        verticalAlign: 'middle',
    };
});

const BoxSTLoginCommon = styled(Box)(() => {
    return {
        display: 'flex',
        flexDirection: 'column',
    };
});

const BoxSTLogin = styled(Box)(() => {
    return {
        width: '318px',
        height: '48px',
        color: 'white',
        backgroundColor: '#59996B',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    };
});

const BoxSTLoginMaintain = styled(Box)(() => {
    return {
        marginTop: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        paddingLeft: '5px',
    };
});

// 카카오 및 네이버 로그인 버튼 스타일
const StyledLoginButton = styled(Box)(() => {
    return {
        width: '313px',
        height: '39px',
        borderRadius: '20px',
        fontSize: '14px',
        lineHeight: '19.07px',
        fontWeight: 600,
        textTransform: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
