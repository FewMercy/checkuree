"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageValidatorPipe = void 0;
const common_1 = require("@nestjs/common");
const ImageValidatorPipe = (maxSizeInMB) => {
    return new common_1.ParseFilePipe({
        fileIsRequired: false,
        validators: [
            new common_1.FileTypeValidator({
                fileType: /image\/[a-zA-Z]*$/,
            }),
            new common_1.MaxFileSizeValidator({
                maxSize: 1024 * 1024 * maxSizeInMB,
            }),
        ],
    });
};
exports.ImageValidatorPipe = ImageValidatorPipe;
//# sourceMappingURL=image-validator.pipe.js.map