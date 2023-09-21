import { User } from 'src/schemas/users/entities/user.entity';
import { UserRole } from 'src/types/user-role';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
    default: UserRole.MEMBER,
  })
  role: string;

  //relations
  @OneToOne(() => User, (user) => user.userType)
  @Column({
    nullable: false,
  })
  userId: string;
}
