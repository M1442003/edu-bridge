import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { ClassEntity } from '../classes/class.entity';

@Entity()
export class Timetable {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: true })
    lecturer: User;

    @ManyToOne(() => ClassEntity, { eager: true })
    class: ClassEntity;

    @Column()
    dayOfWeek: number;

    @Column({ type: 'time' })
    startTime: string;

    @Column({ type: 'time' })
    endTime: string;

    @Column({ default: false })
    reminderSent: boolean;

    @Column()
    venue: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}