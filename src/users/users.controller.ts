import { Controller, Get, Request, UseGuards, Patch, Body, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.sub);
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(@Request() req, @Body() updateData: any) {
    return this.usersService.updateProfile(req.user.sub, updateData);
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  changePassword(
    @Request() req,
    @Body() data: { oldPassword: string; newPassword: string },
  ) {
    return this.usersService.changePassword(req.user.sub, data.oldPassword, data.newPassword);
  }

  @Get('modules')
  @UseGuards(AuthGuard('jwt'))
  getStudentModules(@Request() req) {
    return this.usersService.getStudentModules(req.user.sub);
  }
}