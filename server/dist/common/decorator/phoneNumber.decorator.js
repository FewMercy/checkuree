"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileNumberTransform = void 0;
const class_transformer_1 = require("class-transformer");
function MobileNumberTransform() {
    return (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.replace(/[\s-]/g, '');
        }
        return value;
    });
}
exports.MobileNumberTransform = MobileNumberTransform;
//# sourceMappingURL=phoneNumber.decorator.js.map