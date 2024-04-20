"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConstants = exports.SALT = void 0;
const process = require("node:process");
exports.SALT = 13;
exports.jwtConstants = {
    accessTokenSecret: 'This is my super secret',
    refreshTokenSecret: 'This is my super super secret',
    accessTokenExpiresIn: process.env.NODE_ENV === 'production' ? '300s' : '1d',
    refreshTokenExpiresIn: '1d',
    autoLoginRefreshTokenExpiresIn: '30d',
};
//# sourceMappingURL=auth.const.js.map