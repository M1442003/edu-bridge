import { Controller, Post, Body, Get, Param, UseGuards, Request, Put, Delete, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import AnnouncementsService from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreateAnnouncementDto, @Request() req) {
    return this.announcementsService.create(dto, req.user);
  }

  @Get('class/:classId')
  @UseGuards(AuthGuard('jwt'))
  findByClass(@Param('classId') classId: string) {
    return this.announcementsService.findByClass(parseInt(classId));
  }

  @Get('dashboard')
  @UseGuards(AuthGuard('jwt'))
  async getDashboardAnnouncements(@Request() req) {
    const user = req.user;
    if (user.classId) {
      return this.announcementsService.getDashboardAnnouncements(user.classId);
    }
    return [];
  }

  @Get('recent')
  @UseGuards(AuthGuard('jwt'))
  async getRecentAnnouncements(@Request() req, @Query('limit') limit?: string) {
    const user = req.user;
    if (user.classId) {
      const limitNum = limit ? parseInt(limit) : 5;
      return this.announcementsService.getRecentAnnouncements(user.classId, limitNum);
    }
    return [];
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findById(@Param('id') id: string) {
    return this.announcementsService.findById(parseInt(id));
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.announcementsService.findAll();
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() dto: Partial<CreateAnnouncementDto>) {
    return this.announcementsService.update(parseInt(id), dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return this.announcementsService.delete(parseInt(id));
  }
}