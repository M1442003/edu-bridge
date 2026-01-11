import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { ClassEntity } from '../classes/class.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  STUDENT = 'STUDENT',
  LECTURER = 'LECTURER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;


  @Exclude()
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ClassEntity, (cls) => cls.students, { eager: true })
  class: ClassEntity;

  @Column({ unique: true })
  regNo: string;

}
