import { Item } from 'src/schemas/items/entities/item.entity';
import { Order } from 'src/schemas/orders/entities/order.entity';
import { Review } from 'src/schemas/reviews/entities/review.entity';
import { UserGender } from 'src/types/user-gender.type';
import { UserPricingRange } from 'src/types/user-pricing-range.type';
import { UserRole } from 'src/types/user-role';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  userName: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: true,
    unique: true,
  })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserGender,
    nullable: true,
    default: UserGender.NOT_SPECIFIED,
  })
  gender: UserGender;

  @Column({
    type: 'simple-json',
    nullable: true,
    default: {
      max: 50,
      min: 0,
    },
  })
  pricingRange: UserPricingRange;

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: true,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  // @Column({
  //   nullable: true,
  //   type: 'simple-array',
  // })
  // paymentMethods: string[];

  @Column({
    nullable: true,
  })
  avatar: string;

  // relations

  @OneToMany(() => Order, (order) => order.userId)
  orders: string[];

  @OneToMany(() => Review, (review) => review.userId)
  reviews: string[];

  @OneToMany(() => Item, (item) => item.userRecentVisited)
  @Column({
    type: 'simple-array',
    nullable: true,
  })
  recentVisited: string[];

  @OneToMany(() => Item, (item) => item.userWishlist)
  @Column({
    type: 'simple-array',
    nullable: true,
  })
  wishlist: string[];

  @OneToMany(() => Item, (item) => item.userCart)
  @Column({
    type: 'simple-json',
    nullable: true,
  })
  cart: {
    itemId: string;
    quantity: number;
  }[];
}
