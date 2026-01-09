import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne } from 'typeorm';
import { ClassEntity } from '../classes/class.entity';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => ClassEntity, (classEntity) => classEntity.announcements)
  class: ClassEntity;

  @CreateDateColumn()
  createdAt: Date;
}
