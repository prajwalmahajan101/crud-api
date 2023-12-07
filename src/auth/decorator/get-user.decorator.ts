import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthRequest } from '../interface';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): User => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new UnauthorizedException({ description: 'Unauthorized' });
    if (data) return user[data];
    return user;
  },
);
