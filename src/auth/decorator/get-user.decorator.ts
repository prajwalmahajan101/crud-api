import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthRequest } from '../interface';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
