import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';
import * as argon from 'argon2';

import { PrismaService } from '@/prisma/prisma.service';

import { AuthDto } from './dto';
import { IPayload } from './interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signIn(dto: AuthDto) {
    // Find User
    const user: User = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // If User does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials Incorrect');
    // Compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    // If password is incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials Incorrect');
    // Send back the User/Token
    // delete user.hash;
    const access_token = await this.#signToken(user.id, user.email);
    return { access_token };
  }

  async signUp(dto: AuthDto) {
    // Generate the Password Hash
    const hash = await argon.hash(dto.password);
    // Save the new User
    try {
      const user: User = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
      });

      delete user.hash;
      // return the saved User
      return { user };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
      }
    }
  }

  #signToken(userId: number, email: string): Promise<string> {
    const payload: IPayload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    return this.jwt.signAsync(payload, { expiresIn: '15m', secret });
  }
}
