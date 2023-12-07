import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '@/auth/interface';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
