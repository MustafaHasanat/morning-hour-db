import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { LoginUserDto } from './login-user.dto';
import { UserGender } from 'src/types/user-gender.type';
import { UserPricingRange } from 'src/types/user-pricing-range.type';

export class CreateUserDto extends PartialType(LoginUserDto) {
  @IsNotEmpty()
  @ApiProperty({ example: 'Jack' })
  userName: string;

  @ApiProperty({ example: '00962780387522' })
  phoneNumber?: string;

  @ApiProperty({ example: UserGender.MALE })
  gender?: UserGender;

  @ApiProperty({
    example: {
      max: 50,
      min: 0,
    },
  })
  pricingRange?: UserPricingRange;

  @ApiProperty({ example: 'Jordan, Amman' })
  address?: string;

  @ApiProperty({ example: false })
  isAdmin?: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    example: 'url',
  })
  avatar?: Express.Multer.File;
}
