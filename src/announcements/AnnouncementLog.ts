import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Announcement } from './announcements.entity';
import { User } from '../users/user.entity';

@Entity('announcement_logs')
export class AnnouncementLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Announcement)
  announcement: Announcement;

  @ManyToOne(() => User)
  student: User;

  @Column({ default: false })
  delivered: boolean;

  @CreateDateColumn()
  createdAt: Date;
}