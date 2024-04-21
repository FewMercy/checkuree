import { ArgumentsHost, ConsoleLogger, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly httpAdapterHost;
    private readonly logger;
    constructor(httpAdapterHost: HttpAdapterHost, logger: ConsoleLogger);
    catch(exception: any, host: ArgumentsHost): void;
}
