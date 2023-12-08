import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

import { AuthRequest, IPayload } from '../interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthRequest = context.switchToHttp().getRequest();
    const token = this.extractTokenFormHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token Not Provided');
    }
    try {
      const payload = await this.jwt.verifyAsync<IPayload>(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      const user: User | null = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });
      request.user = user ?? undefined;
    } catch (err) {
      throw new UnauthorizedException('Invalid Token');
    }
    if (!request.user) {
      throw new UnauthorizedException('Invalid Token');
    }
    return true;
  }

  private extractTokenFormHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
