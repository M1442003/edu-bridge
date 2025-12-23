import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) {}

  @Post(':classId')
  create(
    @Param('classId') classId: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.announcementsService.create(classId, title, content);
  }

  @Get('class/:classId')
  findByClass(@Param('classId') classId: number) {
    return this.announcementsService.findByClass(classId);
  }
}
