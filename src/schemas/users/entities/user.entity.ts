// import { Item } from 'src/schemas/items/entities/item.entity';
// import { Order } from 'src/schemas/orders/entities/order.entity';
// import { Review } from 'src/schemas/reviews/entities/review.entity';
import { Order } from 'src/schemas/orders/entities/order.entity';
import { Review } from 'src/schemas/reviews/entities/review.entity';
import { UserGender } from 'src/types/user-gender.type';
import { UserPricingRange } from 'src/types/user-pricing-range.type';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
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
  })
  phoneNumber: number;

  @Column({
    type: 'enum',
    enum: UserGender,
    nullable: false,
    default: UserGender.MALE,
  })
  gender: UserGender;

  @Column({
    type: 'simple-json',
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

  @Column({ nullable: false, default: false })
  isAdmin: boolean;

  @Column({
    nullable: true,
    type: 'simple-array',
  })
  paymentMethods: string[];

  @Column({
    nullable: true,
  })
  avatar: string;

  // relations

  // @OneToMany(() => Item, (item) => item.user)
  // recentVisited: Item[];

  // @OneToMany(() => Item, (item) => item.user)
  // wishlist: Item[];

  // @OneToMany(() => Item, (item) => item.user)
  // @Column({
  //   type: 'simple-json',
  //   nullable: true,
  // })
  // cart: {
  //   item: Item;
  //   quantity: number;
  // }[];

  @OneToMany(() => Order, (order) => order.userId)
  orders: string[];

  @OneToMany(() => Review, (review) => review.userId)
  reviews: string[];
}
