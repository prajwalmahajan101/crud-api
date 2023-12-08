import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  applyDecorators,
  UseInterceptors,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dto';

export class RemoveHashInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        return plainToInstance(UserDto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

export const RemoveHash = () => {
  return applyDecorators(UseInterceptors(RemoveHashInterceptor));
};
