import { Controller, Post, Get, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BulkRegisterDto } from '../auth/dto/bulk-register.dto';


@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Post('students')
    createStudent(@Body() dto: CreateUserDto) {
        return this.adminService.createStudent(dto);
    }

    @Post('assign-lecturer')
    assignLecturer(@Body() body: { lecturerId: number; moduleIds: number[] }) {
        return this.adminService.assignLecturerToModules(body.lecturerId, body.moduleIds);
    }
    @Post('lecturers')
    createLecturer(@Body() dto: CreateUserDto) {
        return this.adminService.createLecturer(dto);
    }

    @Post('students/bulk')
    createBulk(@Body() dtos: BulkRegisterDto[]) {
        return this.adminService.createBulkStudents(dtos);
    }

    @Get('users')
    getAllUsers() {
        return this.adminService.getAllUsers();
    }

    @Delete('users/:id')
    deactivateUser(@Param('id') id: string) {
        return this.adminService.deactivateUser(id);
    }

    @Post('assign')
    assignStudent(@Body() body: { studentId: number; classId: number }) {
        return this.adminService.assignStudentToClass(body.studentId, body.classId);
    }
}