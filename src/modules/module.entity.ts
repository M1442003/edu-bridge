import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Course } from '../courses/course.entity';
import { ClassEntity } from '../classes/class.entity';
import { Semester } from '../common/enums/semester.enum';


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

  @ManyToOne(() => ClassEntity, (cls) => cls.modules, {
    onDelete: 'CASCADE',
  })
  class: ClassEntity;
}