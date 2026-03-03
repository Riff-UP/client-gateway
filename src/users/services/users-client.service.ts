import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE } from '../../config/services.js';
import { firstValueFrom, catchError } from 'rxjs';
import { handleRpcCustomError } from '../../common/index.js';

@Injectable()
export class UsersClientService {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
  ) {}

  async findUserById(id: string) {
    return await firstValueFrom(
      this.usersClient
        .send('findUserById', id)
        .pipe(catchError(handleRpcCustomError)),
    );
  }
}
