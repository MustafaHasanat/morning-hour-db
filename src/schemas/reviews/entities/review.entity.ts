import { Item } from 'src/schemas/items/entities/item.entity';
import { User } from 'src/schemas/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  text: string;

  @Column({
    nullable: false,
  })
  rating: number;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @ManyToOne(() => Item, (item) => item.reviews)
  item: Item;
}
