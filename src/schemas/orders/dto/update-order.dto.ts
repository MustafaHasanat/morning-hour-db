import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({
    example: 'd996b291-ea4e-486d-a2a3-f79676bfe13c',
    required: false,
  })
  userId?: string;

  @ApiProperty({
    example: [
      'd996b291-ea4e-486d-a2a3-f79676bfe13c',
      'd996b291-ea4e-486d-a2a3-f79676bfe13d',
    ],
    required: false,
  })
  items?: string[];
}
