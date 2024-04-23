"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelService = void 0;
const common_1 = require("@nestjs/common");
const XLSX = require("xlsx");
let ExcelService = class ExcelService {
    extractDataFromExcel(fileBuffer, headerToDbMapper) {
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const dataRows = jsonData.slice(1);
        const excelHeader = jsonData[0];
        const mappedData = dataRows.map((row) => {
            const rowObject = {};
            excelHeader.forEach((columnName, index) => {
                const dbFieldName = headerToDbMapper[columnName];
                if (dbFieldName) {
                    rowObject[dbFieldName] = row[index];
                }
            });
            return rowObject;
        });
        return mappedData;
    }
    exportDataToExcel(exportData, dbToHeaderMapper) {
        const dataForExcel = exportData.map((member) => {
            const mappedData = {};
            Object.keys(dbToHeaderMapper).forEach((dbKey) => {
                const excelHeader = dbToHeaderMapper[dbKey];
                mappedData[excelHeader] = member[dbKey];
            });
            return mappedData;
        });
        const excelHeaders = Object.values(dbToHeaderMapper);
        const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { header: excelHeaders });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        return excelBuffer;
    }
};
exports.ExcelService = ExcelService;
exports.ExcelService = ExcelService = __decorate([
    (0, common_1.Injectable)()
], ExcelService);
//# sourceMappingURL=excel.service.js.map