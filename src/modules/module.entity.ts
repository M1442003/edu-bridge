import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Course } from '../courses/course.entity';
import { ClassEntity } from '../classes/class.entity';
import { Semester } from '../common/enums/semester.enum';
import { Assignment } from '../assignments/assignments.entity';
import { Announcement } from '../announcements/announcements.entity';
import { User } from '../users/user.entity';
@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  year: number;

  @Column({
    type: 'enum',
    enum: Semester,
  })
  semester: Semester;

  @ManyToOne(() => Course, (course) => course.modules, {
    onDelete: 'CASCADE',
  })
  course: Course;

  @ManyToMany(() => ClassEntity, (cls) => cls.modules)
  classes: ClassEntity[];

  @OneToMany(() => Assignment, (a) => a.module)
  assignments: Assignment[];

  @OneToMany(() => Announcement, (a) => a.module)
  announcements: Announcement[];
}
