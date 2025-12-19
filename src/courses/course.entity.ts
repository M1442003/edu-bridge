import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Module } from '../modules/module.entity';
import { ClassEntity } from '../classes/class.entity';

export enum CourseLevel {
  DIPLOMA = 'DIPLOMA',
  BACHELOR = 'BACHELOR',
}

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CourseLevel,
  })
  level: CourseLevel;

  @OneToMany(() => Module, (module) => module.course)
  modules: Module[];

  @OneToMany(() => ClassEntity, (cls) => cls.course)
  classes: ClassEntity[];
}
