import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { ClassEntity } from '../classes/class.entity';

@Entity()
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => ClassEntity, (cls) => cls.announcements, { onDelete: 'CASCADE' })
  class: ClassEntity;

  @CreateDateColumn()
  createdAt: Date;
}
