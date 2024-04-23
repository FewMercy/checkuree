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
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const AWS = require("aws-sdk");
const config_1 = require("@nestjs/config");
let S3Service = class S3Service {
    constructor(configService) {
        this.configService = configService;
        this.initializeS3();
    }
    initializeS3() {
        const region = 'ap-northeast-2';
        const credentials = {
            accessKeyId: this.configService.get('AWS_ACCESS_KEY', ''),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY', ''),
        };
        AWS.config.update({ region, credentials });
        this.s3 = new AWS.S3();
    }
    async uploadFile(path, data) {
        const bucketName = this.configService.get('BUCKET_NAME', 'your-default-bucket-name');
        const params = {
            Bucket: bucketName,
            Key: path,
            Body: data,
            ACL: 'public-read',
        };
        try {
            const result = await this.s3.upload(params).promise();
            console.log(result);
            return result.Location;
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('파일 저장에 실패했습니다.');
        }
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3.service.js.map