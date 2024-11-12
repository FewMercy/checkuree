'use client';

//Api
import AuthApiClient, { LoginData } from '@/api/AuthApiClient';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    styled,
} from '@mui/material';
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import axios from 'axios';
import { setTokens } from '@/libs/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import toast from 'react-hot-toast';

const LoginSchema = z.object({
    username: z.string(),
    password: z.string(),
    isAutoLogin: z.boolean(),
});

const initailValues = {
    username: '',
    password: '',
    isAutoLogin: false,
};

const Index = () => {
    const router = useRouter();
    const accessToken = Cookies.get('ACCESS_TOKEN');

    const { mutate: loginMutation } = useMutation({
        mutationKey: ['user'],
        mutationFn: async (params: LoginData) =>
            await AuthApiClient.getInstance().userLogin(params),
        onSuccess: (response) => {
            const token = response.data.data!.accessToken;
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setTokens({
                accessToken: response.data.data!.accessToken,
                refreshToken: response.data.data!.refreshToken,
            });
            toast('로그인 되었습니다.');
            router.push('/attendances');
        },
        onError: () => {
            toast.error('아이디 및 비밀번호가 일치하지 않습니다.');
        },
    });

    const { handleSubmit, getFieldProps, isValid, dirty } = useFormik({
        initialValues: initailValues,
        validationSchema: toFormikValidationSchema(LoginSchema),
        onSubmit: (values: LoginData) => {
            loginMutation(values);
        },
    });

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
                        alt="로고 이미지"
                    />
                </LoginTypographyST>
                <LoginFormBox
                    component="form"
                    onSubmit={(e) => {
                        handleSubmit();
                        e.preventDefault();
                    }}
                >
                    <LoginFormTextBox>
                        <TextField
                            {...getFieldProps('username')}
                            placeholder="아이디를 입력해주세요."
                            inputProps={TextFiledInputProps}
                        />
                        <TextField
                            {...getFieldProps('password')}
                            type="password"
                            placeholder="비밀번호를 입력해주세요."
                            inputProps={TextFiledInputProps}
                        />
                    </LoginFormTextBox>

                    <BoxSTLoginCommon>
                        <StyledCheckureeLoginButton
                            disabled={!(isValid && dirty)}
                            backgroundColor={
                                !(isValid && dirty) ? '#D9D9D9' : '#59996B'
                            }
                            type="submit"
                        >
                            체쿠리 로그인
                        </StyledCheckureeLoginButton>
                        <StyledKakaoLoginButton
                            onClick={() =>
                                router.push(
                                    'https://checkuree.com/api/v1/auth/kakao'
                                )
                            }
                            backgroundColor=""
                        >
                            카카오 로그인
                        </StyledKakaoLoginButton>
                    </BoxSTLoginCommon>
                </LoginFormBox>
            </StyledBoxST>

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

const LoginFormBox = styled(Box)(() => {
    return {
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        justifyContent: 'center',
    };
});
const LoginFormTextBox = styled(Box)(() => {
    return {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    };
});

const BoxSTLoginCommon = styled(Box)(() => {
    return {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    };
});

// 카카오 및 네이버 로그인 버튼 스타일
const StyledLoginButton = styled(Box)(({
    backgroundColor,
}: {
    backgroundColor: string | undefined;
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
        background: backgroundColor,
    };
});

// 체쿠리 로그인 버튼의 색상
const StyledCheckureeLoginButton = styled(Button)(({
    backgroundColor,
}: {
    backgroundColor: string;
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
        alignItems: 'center',
        cursor: 'pointer',
        justifyContent: 'center',
        color: 'white',
        backgroundColor,
        ':hover': {
            backgroundColor,
        },
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
