import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { ClassEntity } from '../classes/class.entity';
import { Exclude } from 'class-transformer';
import { Module } from '../modules/module.entity';

export enum UserRole {
  STUDENT = 'STUDENT',
  LECTURER = 'LECTURER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar' })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ClassEntity, (cls) => cls.students, { eager: true, nullable: true })
  class: ClassEntity | null;

  @ManyToMany(() => Module, (module) => module.lecturers, { eager: true })
  @JoinTable()
  modules: Module[];

  @Column({ type: 'varchar', unique: true, nullable: true })
  regNo: string;

  @Column({ type: 'varchar', nullable: true })
  courseCode: string;

  @Column({ type: 'int', nullable: true })
  year: number;
}