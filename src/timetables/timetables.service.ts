import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timetable } from './timetable.entity';
import { User } from '../users/user.entity';
import { ClassEntity } from '../classes/class.entity';
import { Cron } from '@nestjs/schedule';
import * as nodemailer from 'nodemailer';


@Injectable()
export class TimetablesService {
    constructor(
        @InjectRepository(Timetable)
        private timetableRepo: Repository<Timetable>,

        @InjectRepository(User)
        private userRepo: Repository<User>,

        @InjectRepository(ClassEntity)
        private classRepo: Repository<ClassEntity>,
    ) { }

    async create(body: {
        lecturerId: number;
        classId: number;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        venue: string;
    }) {
        const lecturer = await this.userRepo.findOne({
            where: { id: body.lecturerId },
        });

        const cls = await this.classRepo.findOne({
            where: { id: body.classId },
        });

        if (!lecturer || !cls) {
            throw new Error('Lecturer or Class not found');
        }

        const timetable = this.timetableRepo.create({
            lecturer,
            class: cls,
            dayOfWeek: body.dayOfWeek,
            startTime: body.startTime,
            endTime: body.endTime,
            venue: body.venue,
        });

        return this.timetableRepo.save(timetable);
    }
}
