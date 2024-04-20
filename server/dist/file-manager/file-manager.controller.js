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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileManagerController = void 0;
const common_1 = require("@nestjs/common");
const file_manager_service_1 = require("./file-manager.service");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const file_upload_dto_1 = require("./dto/file-upload.dto");
let FileManagerController = class FileManagerController {
    constructor(fileManagerService) {
        this.fileManagerService = fileManagerService;
    }
    async uploadFiles(files) {
        if (!files) {
            throw new common_1.HttpException('No files uploaded', common_1.HttpStatus.BAD_REQUEST);
        }
        for (const file of files.fileDtos) {
            if (!file.buffer) {
                throw new common_1.BadRequestException('유효하지 않은 파일입니다.');
            }
            const results = await this.fileManagerService.saveFile(file);
        }
        return { message: ` file(s) uploaded successfully.` };
    }
};
exports.FileManagerController = FileManagerController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'fileDtos', maxCount: 10 },
    ])),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Upload one or more files',
        type: file_upload_dto_1.FileUploadDto,
    }),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FileManagerController.prototype, "uploadFiles", null);
exports.FileManagerController = FileManagerController = __decorate([
    (0, common_1.Controller)('file'),
    (0, swagger_1.ApiTags)('[파일업로드]'),
    __metadata("design:paramtypes", [file_manager_service_1.FileManagerService])
], FileManagerController);
//# sourceMappingURL=file-manager.controller.js.map