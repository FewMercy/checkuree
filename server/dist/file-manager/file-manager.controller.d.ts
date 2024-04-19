import { FileManagerService } from './file-manager.service';
export declare class FileManagerController {
    private readonly fileManagerService;
    constructor(fileManagerService: FileManagerService);
    uploadFiles(files: {
        fileDtos: Express.Multer.File[];
    }): Promise<{
        message: string;
    }>;
}
