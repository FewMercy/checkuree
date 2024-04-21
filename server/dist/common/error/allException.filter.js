"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const error_reponse_1 = require("./error-reponse");
let AllExceptionsFilter = class AllExceptionsFilter {
    constructor(httpAdapterHost, logger) {
        this.httpAdapterHost = httpAdapterHost;
        this.logger = logger;
    }
    catch(exception, host) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const httpStatus = exception instanceof common_1.HttpException ? exception.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const errorMessage = exception.response?.message || exception.message || 'Internal server error';
        const errorResponse = new error_reponse_1.ErrorResponse();
        errorResponse.success = false;
        errorResponse.type = exception?.name;
        errorResponse.path = httpAdapter.getRequestUrl(ctx.getRequest());
        errorResponse.timestamp = new Date().toISOString();
        errorResponse.message = errorMessage;
        errorResponse.statusCode = httpStatus;
        this.logger.error({
            message: errorResponse.message,
            path: errorResponse.path,
            statusCode: httpStatus,
        });
        this.logger.error(exception.stack.toString());
        httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost,
        common_1.ConsoleLogger])
], AllExceptionsFilter);
//# sourceMappingURL=allException.filter.js.map