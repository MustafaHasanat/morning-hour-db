import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'd996b291-ea4e-486d-a2a3-f79676bfe13c' })
  userId: string;

  @IsNotEmpty()
  @ApiProperty({
    example: [
      'd996b291-ea4e-486d-a2a3-f79676bfe13c',
      'd996b291-ea4e-486d-a2a3-f79676bfe13d',
    ],
  })
  items: string[];
}
