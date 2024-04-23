"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const auth_const_1 = require("../const/auth.const");
class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: auth_const_1.jwtConstants.accessTokenSecret,
        });
    }
    async validate(payload) {
        return { id: payload.id, username: payload.username, userAttendance: payload.userAttendance };
    }
}
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt.strategy.js.map