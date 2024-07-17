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
exports.ImageProcessorService = void 0;
const common_1 = require("@nestjs/common");
const sharp = require("sharp");
let ImageProcessorService = class ImageProcessorService {
    constructor() { }
    async resize(file, maxLength) {
        try {
            const metadata = await sharp(file.buffer).metadata();
            const width = metadata.width;
            const height = metadata.height;
            if (width < maxLength && height < maxLength) {
                return file.buffer;
            }
            const resizeOption = width >= height ? { width: maxLength } : { height: maxLength };
            return await sharp(file.buffer)
                .withMetadata()
                .resize({ ...resizeOption, fit: 'contain' })
                .toBuffer();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('이미지 리사이징에 실패했습니다');
        }
    }
};
exports.ImageProcessorService = ImageProcessorService;
exports.ImageProcessorService = ImageProcessorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ImageProcessorService);
//# sourceMappingURL=image-processor.service.js.map