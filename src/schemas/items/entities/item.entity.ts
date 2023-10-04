import { MinLength } from 'class-validator';
import { Author } from 'src/schemas/authors/entities/author.entity';
import { Category } from 'src/schemas/categories/entities/category.entity';
import { Order } from 'src/schemas/orders/entities/order.entity';
import { Review } from 'src/schemas/reviews/entities/review.entity';
import {
  Column,
  Entity,
  ManyToMany,
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
    unique: true,
    default: 'item title',
  })
  title: string;

  @MinLength(20)
  @Column({
    nullable: false,
    default: 'short description',
  })
  description: string;

  @Column({
    nullable: false,
    default: 5,
  })
  currentPrice: number;

  @Column({
    nullable: false,
    default: 1,
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

  @Column('text', { array: true, nullable: true })
  screenshots: string[];

  // relations:
  @ManyToOne(() => Category, (category) => category.items)
  category: Category;

  @ManyToOne(() => Author, (author) => author.items)
  author: Author;

  @OneToMany(() => Review, (review) => review.item)
  reviews: Review[];

  @ManyToMany(() => Order)
  orders: Order[];
}
