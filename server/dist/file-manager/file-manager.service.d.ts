import { ImageProcessorService } from './image-processor.service';
import { S3Service } from './s3.service';
export declare class FileManagerService {
    private readonly s3Service;
    private readonly imageProcessorService;
    constructor(s3Service: S3Service, imageProcessorService: ImageProcessorService);
    saveImgFile(file: Express.Multer.File): Promise<string>;
    saveFile(file: Express.Multer.File): Promise<string>;
    private createDirectoryPath;
    private fileTypePathFactory;
    private getDateFolder;
    private createUniqueFileName;
}
