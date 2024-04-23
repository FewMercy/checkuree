/// <reference types="node" />
export declare class ExcelService {
    extractDataFromExcel(fileBuffer: Buffer, headerToDbMapper: {
        [key: string]: string;
    }): {}[];
    exportDataToExcel(exportData: Array<any>, dbToHeaderMapper: {
        [key: string]: string;
    }): Buffer;
}
