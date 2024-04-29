import * as process from 'node:process';

export const SALT = 13;
export const jwtConstants = () => {
  const response = {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    accessTokenExpiresIn: process.env.NODE_ENV === 'production' ? '300s' : '1d',
    refreshTokenExpiresIn: '1d',
    autoLoginRefreshTokenExpiresIn: '30d',
  };

  return response;
};
