// import { Item } from 'src/schemas/items/entities/item.entity';
// import { User } from 'src/schemas/users/entities/user.entity';
// import { Cart } from 'src/types/cart.type';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //relations

  // @ManyToOne(() => User, (user) => user.orders)
  // user: User;

  // @OneToMany(() => Item, (item) => item.order)
  // items: Item[];

  // get cart(): Cart[] {
  //   return this.items.map((item) => ({
  //     items: item,
  //     quantity: 1,
  //   }));
  // }
}
