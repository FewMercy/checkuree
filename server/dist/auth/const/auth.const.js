"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConstants = exports.SALT = void 0;
exports.SALT = 13;
exports.jwtConstants = {
    accessTokenSecret: 'This is my super secret',
    refreshTokenSecret: 'This is my super super secret',
    accessTokenExpiresIn: '300s',
    refreshTokenExpiresIn: '1d',
    autoLoginRefreshTokenExpiresIn: '30d',
};
//# sourceMappingURL=auth.const.js.map