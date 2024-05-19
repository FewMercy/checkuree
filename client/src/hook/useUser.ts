import AuthApiClient from '@/api/AuthApiClient';
import { useQuery } from '@tanstack/react-query';

// birthYear
// birthday
// createdAt
// email
// id
// mobileNumber
// name
// type
// username

const useUser = () => {
    const { data: userInfo } = useQuery({
        queryKey: ['user'],
        queryFn: async () => await AuthApiClient.getInstance().userInfo(),
        retry: false,
        select: (response) => response.data,
    });

    return userInfo;
};

export default useUser;
