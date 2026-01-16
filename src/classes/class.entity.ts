import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn
} from 'typeorm';
import { Course } from '../courses/course.entity';
import { User } from '../users/user.entity';
import { Module as CourseModule } from '../modules/module.entity';
import { Announcement } from '../announcements/announcements.entity';
import { Assignment } from '../assignments/assignments.entity';

@Entity()
export class ClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  year: number;

  @ManyToOne(() => Course, (course) => course.classes, { eager: true })
  course: Course;

  @OneToMany(() => User, (user) => user.class)
  students: User[];


  @ManyToMany(() => CourseModule, (module) => module.classes, { eager: true })
  @JoinTable({
    name: 'class_entity_modules_modules',
    joinColumn: { name: 'classEntityId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'modulesId', referencedColumnName: 'id' },
  })
  modules: CourseModule[];


  @OneToMany(() => Announcement, (announcement) => announcement.class)
  announcements: Announcement[];

  @OneToMany(() => Assignment, (assignment) => assignment.class)
  assignments: Assignment[];

  @CreateDateColumn()
  createdAt: Date;
}
