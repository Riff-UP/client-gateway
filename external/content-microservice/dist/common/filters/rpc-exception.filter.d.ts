import { ArgumentsHost } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { Observable } from 'rxjs';
export declare class GlobalRpcExceptionFilter extends BaseRpcExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): Observable<any>;
}
