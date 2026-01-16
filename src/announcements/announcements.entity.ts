import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { ClassEntity } from '../classes/class.entity';
import { Module } from '../modules/module.entity';
import { User } from '../users/user.entity';
@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => Module, (module) => module.announcements, {
    onDelete: 'CASCADE',
  })
  module: Module;

  @ManyToOne(() => ClassEntity, (classEntity) => classEntity.announcements, {
    onDelete: 'CASCADE',
  })
  class: ClassEntity;

  @ManyToOne(() => User, { nullable: true })
createdBy: User;


  @CreateDateColumn()
  createdAt: Date;
}
