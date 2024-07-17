"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const allException_filter_1 = require("./common/error/allException.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger();
    const port = process.env.PORT || 3000;
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new allException_filter_1.AllExceptionsFilter(app.get(core_1.HttpAdapterHost), new common_1.ConsoleLogger()));
    app.enableCors();
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Attendance')
        .setDescription('Attendance API 서버 설명')
        .setVersion('v1.0')
        .addTag('Attendances')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/v1/swagger', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    logger.verbose('====================================');
    logger.verbose(`==== SERVER IS RUNNING ON ${port} =====`);
    logger.verbose('====================================');
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map