import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ClassEntity } from '../classes/class.entity';
import { Module } from '../modules/module.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  dueDate: Date;

  @ManyToOne(() => Module, (module) => module.assignments, {
    onDelete: 'CASCADE',
  })
  module: Module;

  @Column('json', { nullable: true })
  attachments: {
    originalName: string;
    fileName: string;
    mimeType: string;
    size: number;
  }[];

  @ManyToOne(() => ClassEntity, (cls) => cls.assignments, {
    onDelete: 'CASCADE',
  })
  class: ClassEntity;

  @CreateDateColumn()
  createdAt: Date;
}
