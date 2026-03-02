export interface NormalizedPostPayload {
    sql_user_id: string;
    type: string;
    title: string;
    description?: string;
    provider?: string;
    provider_meta?: Record<string, unknown>;
    content?: string;
}
export declare class UploadService {
    private readonly logger;
    validateProviderLink(provider?: string, content?: string): boolean;
    normalizePostPayload(payload: Record<string, unknown>): NormalizedPostPayload;
}
