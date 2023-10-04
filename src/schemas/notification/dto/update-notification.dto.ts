import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @ApiProperty({
    example: 'd996b291-ea4e-486d-a2a3-f79676bfe13c',
    required: false,
  })
  user?: string;

  @ApiProperty({
    example: 'hello world',
    required: false,
  })
  content?: string;
}
