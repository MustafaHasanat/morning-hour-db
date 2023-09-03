import { Min, MinLength } from 'class-validator';
import { Author } from 'src/schemas/authors/entities/author.entity';
import { Category } from 'src/schemas/categories/entities/category.entity';
import { Order } from 'src/schemas/orders/entities/order.entity';
import { Review } from 'src/schemas/reviews/entities/review.entity';
import { User } from 'src/schemas/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @MinLength(3)
  @Column({
    nullable: false,
    default: 'item title',
  })
  title: string;

  @MinLength(20)
  @Column({
    nullable: false,
    default: 'short description',
  })
  description: string;

  @Min(1)
  @Column({
    nullable: false,
    default: 1,
  })
  currentPrice: number;

  @Min(0)
  @Column({
    nullable: false,
    default: 0,
  })
  oldPrice: number;

  @Column({
    nullable: false,
    default: false,
  })
  isBestSelling: boolean;

  @Column({
    nullable: false,
    default: '#000',
  })
  primaryColor: string;

  @Column({
    nullable: false,
  })
  image: string;

  @Column({
    type: 'simple-array',
    nullable: false,
  })
  screenshots: string[];

  @ManyToOne(() => Category, (category) => category.items)
  category: Category;

  @ManyToOne(() => Author, (author) => author.items)
  author: Author;

  @ManyToOne(() => User, (user) => user.recentVisited)
  user: User;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @OneToMany(() => Review, (review) => review.item)
  reviews: Review[];
}
