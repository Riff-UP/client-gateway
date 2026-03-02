import 'dotenv/config';
export declare const envs: {
    port: number;
    tcpPort: number;
    host: string;
    mongoUri: string;
    rabbitUrl: string;
    r2: {
        endpoint: string;
        accessKey: string;
        secretKey: string;
        bucket: string;
        publicUrl: string;
    };
};
