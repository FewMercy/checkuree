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
var JFileEnum_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JFileEnum = void 0;
const ts_jenum_1 = require("ts-jenum");
let JFileEnum = JFileEnum_1 = class JFileEnum extends (0, ts_jenum_1.EnumType)() {
    constructor(code, path) {
        super();
        this.code = code;
        this.path = path;
    }
};
exports.JFileEnum = JFileEnum;
JFileEnum.IMAGE = new JFileEnum_1('IMAGE', 'img');
JFileEnum.VIDEO = new JFileEnum_1('VIDEO', 'video');
JFileEnum.ETC = new JFileEnum_1('ETC', 'etc');
exports.JFileEnum = JFileEnum = JFileEnum_1 = __decorate([
    (0, ts_jenum_1.Enum)('code'),
    __metadata("design:paramtypes", [String, String])
], JFileEnum);
//# sourceMappingURL=JFile.enum.js.map