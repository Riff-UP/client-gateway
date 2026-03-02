export interface SoundCloudResolved {
    media_url: string;
    provider_meta: Record<string, unknown>;
}
export declare function resolveSoundCloud(url: string): Promise<SoundCloudResolved>;
