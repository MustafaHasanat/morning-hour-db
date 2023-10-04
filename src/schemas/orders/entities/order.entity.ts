import { Item } from 'src/schemas/items/entities/item.entity';
import { User } from 'src/schemas/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    default: new Date(),
  })
  createdAt: Date;

  //relations
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToMany(() => Item)
  items: Item[];
}
