import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NatsService } from 'src/config';

export class AuthorizationGuard implements CanActivate {
  constructor(@Inject(NatsService) private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    if (!token) {
      return false;
    }

    const user = await firstValueFrom(
      this.client.send('auth.verify.user', { token }),
    );

    console.log({ user });
    return !!token;
  }
}
