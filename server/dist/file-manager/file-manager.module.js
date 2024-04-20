"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileManagerModule = void 0;
const common_1 = require("@nestjs/common");
const file_manager_service_1 = require("./file-manager.service");
const file_manager_controller_1 = require("./file-manager.controller");
const image_processor_service_1 = require("./image-processor.service");
const s3_service_1 = require("./s3.service");
const config_1 = require("@nestjs/config");
let FileManagerModule = class FileManagerModule {
};
exports.FileManagerModule = FileManagerModule;
exports.FileManagerModule = FileManagerModule = __decorate([
    (0, common_1.Module)({
        controllers: [file_manager_controller_1.FileManagerController],
        providers: [file_manager_service_1.FileManagerService, image_processor_service_1.ImageProcessorService, s3_service_1.S3Service, config_1.ConfigService],
    })
], FileManagerModule);
//# sourceMappingURL=file-manager.module.js.map