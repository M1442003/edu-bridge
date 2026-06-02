import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { ClassEntity } from '../classes/class.entity';
import { Module } from '../modules/module.entity';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => ClassEntity, cls => cls.announcements)
  class: ClassEntity;

  @ManyToOne(() => Module, module => module.announcements)
  module: Module;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}