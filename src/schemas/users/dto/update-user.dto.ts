import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UserCart } from 'src/types/user-cart';
import { UserRole } from 'src/enums/user-role.enum';
import { UserPricingRange } from 'src/types/user-pricing-range.type';
import { UserGender } from 'src/enums/user-gender.enum';
import { IsEmail } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail()
  @ApiProperty({ example: 'example@example.com', required: false })
  email?: string;

  @ApiProperty({ example: '12345', required: false })
  password?: string;

  @ApiProperty({ example: 'Jack', required: false })
  userName?: string;

  @ApiProperty({ example: '00962780387522', required: false })
  phoneNumber?: string;

  @ApiProperty({
    example: UserGender.MALE,
    default: UserGender.NOT_SPECIFIED,
    required: false,
  })
  gender?: UserGender;

  @ApiProperty({
    example: {
      max: 50,
      min: 0,
    },
    required: false,
  })
  pricingRange?: UserPricingRange;

  @ApiProperty({ example: 'Jordan, Amman', required: false })
  address?: string;

  @ApiProperty({
    example: UserRole.MEMBER,
    default: UserRole.MEMBER,
    required: false,
  })
  role?: UserRole;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    example: 'url',
    required: false,
  })
  avatar?: Express.Multer.File;

  @ApiProperty({
    example: ['d996b291-ea4e-486d-a2a3-f79676bfe13c'],
    required: false,
  })
  recentVisited?: string[];

  @ApiProperty({
    example: ['d996b291-ea4e-486d-a2a3-f79676bfe13c'],
    required: false,
  })
  wishlist?: string[];

  @ApiProperty({
    example: {
      itemId: 'd996b291-ea4e-486d-a2a3-f79676bfe13c',
      quantity: 3,
    },
    required: false,
  })
  cart?: UserCart[];
}
