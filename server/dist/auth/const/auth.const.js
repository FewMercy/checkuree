"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConstants = exports.SALT = void 0;
const process = require("node:process");
exports.SALT = 13;
const jwtConstants = () => {
    const response = {
        accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
        refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
        accessTokenExpiresIn: process.env.NODE_ENV === 'production' ? '300s' : '1d',
        refreshTokenExpiresIn: '1d',
        autoLoginRefreshTokenExpiresIn: '30d',
    };
    return response;
};
exports.jwtConstants = jwtConstants;
//# sourceMappingURL=auth.const.js.map