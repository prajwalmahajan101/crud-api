import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign Up' })
  @ApiBody({ type: AuthDto })
  @ApiBadRequestResponse({ description: 'Invalid Input' })
  @ApiForbiddenResponse({ description: 'Credentials Taken' })
  @ApiCreatedResponse({ description: 'User Registered' })
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOperation({ summary: 'Sign In' })
  @ApiBody({ type: AuthDto })
  @ApiBadRequestResponse({ description: 'Invalid Input' })
  @ApiForbiddenResponse({ description: 'Credentials Incorrect' })
  @ApiOkResponse({ description: 'User Logged In' })
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }
}
