"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrmConfig = void 0;
const config_1 = require("@nestjs/config");
const getOrmConfig = () => {
    const configService = new config_1.ConfigService();
    const ormConfig = {
        type: configService.get('DB_TYPE'),
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
        logging: configService.get('DB_LOGGING') === 'true',
        poolSize: +configService.get('DB_POOL_SIZE'),
        charset: configService.get('DB_CHARSET'),
        autoLoadEntities: true,
    };
    return ormConfig;
};
exports.getOrmConfig = getOrmConfig;
//# sourceMappingURL=orm.config.js.map