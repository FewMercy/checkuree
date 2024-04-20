/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
export declare class S3Service {
    private configService;
    private s3;
    constructor(configService: ConfigService);
    private initializeS3;
    uploadFile(path: string, data: Buffer): Promise<string>;
}
