import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../types/authRequest.type';

export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
