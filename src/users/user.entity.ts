import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
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

  @ManyToOne(() => ClassEntity, (cls) => cls.students, { eager: true, nullable: true })
  class: ClassEntity | null;

  @Column({ unique: true })
  regNo: string;

  @Column({ nullable: true })
  courseCode: string;

  @Column({ nullable: true })
  year: number;

}