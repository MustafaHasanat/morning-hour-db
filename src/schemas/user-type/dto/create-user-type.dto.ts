import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/types/user-role';

export class CreateUserTypeDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'd996b291-ea4e-486d-a2a3-f79676bfe13c' })
  userId: string;

  @IsNotEmpty()
  @ApiProperty({
    example: UserRole.MEMBER,
  })
  role: UserRole;
}
