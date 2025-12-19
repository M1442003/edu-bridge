// class.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { Course } from '../courses/course.entity';
import { User } from '../users/user.entity';
import { Module as CourseModule } from '../modules/module.entity';

@Entity()
export class ClassEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    year: number;

    @ManyToOne(() => Course, (course) => course.classes)
    course: Course;

    @ManyToMany(() => User, (user) => user.classes)
    @JoinTable()
    students: User[];

    @ManyToMany(() => CourseModule)
    @JoinTable()
    modules: CourseModule[];

    @CreateDateColumn()
    createdAt: Date;
}
