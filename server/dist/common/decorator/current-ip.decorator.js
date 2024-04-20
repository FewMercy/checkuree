"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentIp = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentIp = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-forwarded-for'] || request.connection.remoteAddress;
});
//# sourceMappingURL=current-ip.decorator.js.map