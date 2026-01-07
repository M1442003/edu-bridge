import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ClassEntity } from '../classes/class.entity';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => ClassEntity, (cls) => cls.announcements, {
    onDelete: 'CASCADE',
  })
  class: ClassEntity;
}