import { MinLength } from 'class-validator';
import { Item } from 'src/schemas/items/entities/item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @MinLength(3)
  @Column({
    nullable: false,
    default: 'category title',
  })
  title: string;

  @Column({
    nullable: false,
  })
  image: string;

  @OneToMany(() => Item, (item) => item.category)
  items: Item[];
}
