import { MinLength } from 'class-validator';
import { Item } from 'src/schemas/items/entities/item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @MinLength(3)
  @Column({
    nullable: false,
    default: 'Jack',
  })
  name: string;

  @MinLength(20)
  @Column({
    nullable: false,
    default: 'short description',
  })
  brief: string;

  @Column({
    nullable: false,
  })
  image: string;

  // relations:

  @OneToMany(() => Item, (item) => item.authorId)
  items: Item[];
}
