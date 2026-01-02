import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../roles/roles.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => Role)
  role: Role;
}
