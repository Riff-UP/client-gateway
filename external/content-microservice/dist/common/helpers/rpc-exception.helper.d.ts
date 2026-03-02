export declare class RpcExceptionHelper {
    static notFound(resource: string, id?: string): void;
    static conflict(message: string): void;
    static badRequest(message: string): void;
    static unauthorized(message?: string): void;
    static internal(message?: string): void;
}
