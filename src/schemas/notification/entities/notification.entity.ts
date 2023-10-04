import { User } from 'src/schemas/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    default: new Date(),
  })
  createdAt: Date;

  @Column({
    nullable: false,
    default: '[placeholder]',
  })
  content: string;

  @Column({
    nullable: false,
    default: false,
  })
  isRead: boolean;

  //relations
  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}
