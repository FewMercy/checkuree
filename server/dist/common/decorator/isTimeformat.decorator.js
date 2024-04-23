"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsTimeFormat = void 0;
const class_validator_1 = require("class-validator");
let IsTimeFormatConstraint = class IsTimeFormatConstraint {
    validate(time, args) {
        if (typeof time !== 'string' || time.length !== 4) {
            return false;
        }
        const hour = time.slice(0, time.length - 2);
        const minute = time.slice(time.length - 2);
        return !(parseInt(hour) >= 24 || parseInt(minute) >= 60);
    }
    defaultMessage(args) {
        return 'Invalid time format';
    }
};
IsTimeFormatConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: false })
], IsTimeFormatConstraint);
function IsTimeFormat(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsTimeFormatConstraint,
        });
    };
}
exports.IsTimeFormat = IsTimeFormat;
//# sourceMappingURL=isTimeformat.decorator.js.map