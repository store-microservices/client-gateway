import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RegisterUserDto, LoginUserDto } from './dto';
import { catchError } from 'rxjs';
import { NatsService } from 'src/config';
import { AuthorizationGuard } from 'guards/authorization.guard';
import { Token } from 'decorators/token';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NatsService) private readonly client: ClientProxy) {}

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    return this.client.send('auth.register.user', registerDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('me')
  @UseGuards(AuthorizationGuard)
  async getMe(@Token() token: string) {
    return this.client.send('auth.getMe.user', { token }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
