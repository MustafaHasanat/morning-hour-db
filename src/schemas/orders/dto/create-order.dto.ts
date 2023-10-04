import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'd996b291-ea4e-486d-a2a3-f79676bfe13c' })
  user: string;

  @ApiProperty({
    example: [
      'd996b291-ea4e-486d-a2a3-f79676bfe13c',
      'd996b291-ea4e-486d-a2a3-f79676bfe13d',
    ],
  })
  items: string[];
}
