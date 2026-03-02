import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface RpcResponse<T> {
    success: boolean;
    data: T;
    message: string;
}
export declare class RpcResponseInterceptor<T> implements NestInterceptor<T, RpcResponse<T>> {
    intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<RpcResponse<T>>;
}
