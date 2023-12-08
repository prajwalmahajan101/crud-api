import { Expose } from 'class-transformer';
export class UserDto {
  @Expose()
  id: number;
  @Expose()
  email: string;
  @Expose()
  firstName?: string | null;
  @Expose()
  lastName?: string | null;
  @Expose()
  createdAt: string;
  @Expose()
  updatedAt: string;
}
