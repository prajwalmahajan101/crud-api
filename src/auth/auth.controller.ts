import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiBody({ type: AuthDto })
  @ApiForbiddenResponse({ description: 'Credentials Taken' })
  @ApiCreatedResponse({ description: 'User Registered' })
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  @ApiBody({ type: AuthDto })
  @ApiForbiddenResponse({ description: 'Credentials Incorrect' })
  @ApiOkResponse({ description: 'User Logged In' })
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }
}
