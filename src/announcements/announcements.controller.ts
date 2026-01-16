import { Controller, Post, Get, Param, Body, Req } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) { }
  @Post()
  async create(
    @Body() dto: CreateAnnouncementDto,
    @Req() req,
  ) {
    return this.announcementsService.create(dto, req.user);
  }


  @Get('class/:classId')
  async findByClass(@Param('classId') classId: number) {
    return this.announcementsService.findByClass(classId);
  }
}