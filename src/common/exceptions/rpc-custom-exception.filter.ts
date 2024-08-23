import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();
    const rpcError = exception.getError();

    console.log('rpcError', rpcError);
    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      typeof rpcError.status === 'number' &&
      'message' in rpcError
    ) {
      return response.status(rpcError.status).json({
        statusCode: rpcError.status,
        message: rpcError.message,
      });
    }

    return response.status(500).json({
      statusCode: 500,
      message:
        typeof rpcError === 'string' ? rpcError : 'Internal server error',
    });
  }
}
