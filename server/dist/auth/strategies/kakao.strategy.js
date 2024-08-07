"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KakaoStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_kakao_1 = require("passport-kakao");
const login_type_enum_1 = require("../const/login-type.enum");
const process = require("node:process");
class KakaoStrategy extends (0, passport_1.PassportStrategy)(passport_kakao_1.Strategy, 'kakao') {
    constructor() {
        super({
            clientID: process.env.KAKAO_ID,
            clientSecret: process.env.KAKAO_SECRET_KEY,
            callbackURL: process.env.KAKAO_CALLBACK_URL,
        });
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { id, username, displayName, email, mobile_number } = profile;
        const user = {
            username: id,
            loginType: login_type_enum_1.LoginType.KAKAO,
            name: username,
            email,
            mobileNumber: mobile_number,
        };
        done(null, user);
    }
}
exports.KakaoStrategy = KakaoStrategy;
//# sourceMappingURL=kakao.strategy.js.map