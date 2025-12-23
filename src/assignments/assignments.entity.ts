import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { ClassEntity } from '../classes/class.entity';

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

  @ManyToOne(() => ClassEntity, (cls) => cls.assignments, { onDelete: 'CASCADE' })
  class: ClassEntity;

  @CreateDateColumn()
  createdAt: Date;
}
