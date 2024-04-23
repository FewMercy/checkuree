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
exports.FileManagerService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@js-joda/core");
const path = require("path");
const image_processor_service_1 = require("./image-processor.service");
const JFile_enum_1 = require("./const/JFile.enum");
const file_const_1 = require("./const/file.const");
const s3_service_1 = require("./s3.service");
let FileManagerService = class FileManagerService {
    constructor(s3Service, imageProcessorService) {
        this.s3Service = s3Service;
        this.imageProcessorService = imageProcessorService;
    }
    async saveImgFile(file) {
        const directoryPath = this.createDirectoryPath(file);
        const uniqueFileName = this.createUniqueFileName(file.originalname);
        const filePath = path.join(directoryPath, uniqueFileName);
        const resizedBuffer = await this.imageProcessorService.resize(file, file_const_1.IMAGE_MAX_LENGTH);
        return await this.s3Service.uploadFile(filePath, resizedBuffer);
    }
    async saveFile(file) {
        const directoryPath = this.createDirectoryPath(file);
        const uniqueFileName = this.createUniqueFileName(file.originalname);
        const filePath = path.join(directoryPath, uniqueFileName);
        const location = await this.s3Service.uploadFile(filePath, file.buffer);
        console.log(decodeURIComponent(location));
        return location;
    }
    createDirectoryPath(file) {
        console.log(file);
        const fileType = file.mimetype.split('/')[0];
        const fileTypePath = this.fileTypePathFactory(fileType);
        const directoryPath = path.join(fileTypePath, this.getDateFolder());
        return directoryPath;
    }
    fileTypePathFactory(fileType) {
        switch (fileType.toLowerCase()) {
            case 'image':
                return JFile_enum_1.JFileEnum.IMAGE.path;
            case 'video':
                return JFile_enum_1.JFileEnum.VIDEO.path;
            default:
                return JFile_enum_1.JFileEnum.ETC.path;
        }
    }
    getDateFolder() {
        return core_1.LocalDate.now().toString().replace(/-/g, '');
    }
    createUniqueFileName(fileOriginalName) {
        const index = fileOriginalName.lastIndexOf('.');
        const fileName = fileOriginalName.substring(0, index);
        const ext = fileOriginalName.substring(index);
        const now = core_1.LocalTime.now();
        const timeStamp = now.hour() + now.minute() + now.second() + now.nano();
        return `${fileName}_${timeStamp}${ext}`;
    }
};
exports.FileManagerService = FileManagerService;
exports.FileManagerService = FileManagerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [s3_service_1.S3Service,
        image_processor_service_1.ImageProcessorService])
], FileManagerService);
//# sourceMappingURL=file-manager.service.js.map