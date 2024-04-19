/// <reference types="node" />
export declare class ImageProcessorService {
    constructor();
    resize(file: Express.Multer.File, maxLength: number): Promise<Buffer>;
}
