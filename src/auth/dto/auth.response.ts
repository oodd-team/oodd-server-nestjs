import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from 'src/common/entities/user.entity';

export class LoginResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' })
  jwt: string;
}

export class UserDto extends PickType(User, [
  'id',
  'name',
  'nickname',
  'email',
  'profilePictureUrl',
]) {}
