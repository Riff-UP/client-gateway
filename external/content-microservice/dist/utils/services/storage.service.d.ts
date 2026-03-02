export declare class StorageService {
    private readonly logger;
    private readonly client;
    private readonly bucket;
    private readonly publicUrl;
    constructor();
    upload(buffer: Buffer, originalName: string, contentType: string): Promise<string>;
    delete(publicUrl: string): Promise<void>;
    extractKey(url: string): string;
    private extFromMime;
}
