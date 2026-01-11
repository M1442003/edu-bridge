import { Controller, Post, Body } from '@nestjs/common';
import { TimetablesService } from './timetables.service';

@Controller('timetables')
export class TimetablesController {
    constructor(private readonly service: TimetablesService) { }

    @Post()
    create(@Body() body: any) {
        return this.service.create(body);
    }
}