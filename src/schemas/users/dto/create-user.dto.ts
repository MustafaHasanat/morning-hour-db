import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { LoginUserDto } from './login-user.dto';
import { UserGender } from 'src/types/user-gender.type';
import { UserPricingRange } from 'src/types/user-pricing-range.type';
import { UserCart } from 'src/types/user-cart';
import { UserRole } from 'src/types/user-role';

export class CreateUserDto extends PartialType(LoginUserDto) {
  @IsNotEmpty()
  @ApiProperty({ example: 'Jack' })
  userName: string;

  @ApiProperty({ example: '00962780387522' })
  phoneNumber?: string;

  @ApiProperty({ example: UserGender.MALE, default: UserGender.NOT_SPECIFIED })
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

  @ApiProperty({ example: UserRole.MEMBER, default: UserRole.MEMBER })
  role?: UserRole;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    example: 'url',
  })
  avatar?: Express.Multer.File;

  @ApiProperty({ example: ['d996b291-ea4e-486d-a2a3-f79676bfe13c'] })
  recentVisited?: string[];

  @ApiProperty({ example: ['d996b291-ea4e-486d-a2a3-f79676bfe13c'] })
  wishlist?: string[];

  @ApiProperty({
    example: {
      itemId: 'd996b291-ea4e-486d-a2a3-f79676bfe13c',
      quantity: 3,
    },
  })
  cart?: UserCart[];
}
