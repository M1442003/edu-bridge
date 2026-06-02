import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto as RegisterDto } from './dto/register.dto';
import { BulkRegisterDto } from './dto/bulk-register.dto';
import { Public } from './public.decorator';  

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('register/bulk')
  registerBulk(@Body() body: { users: BulkRegisterDto[] }) {
    return this.authService.registerBulk(body.users);
  }

  @Post('register/lecturer')
  registerLecturer(@Body() dto: Omit<RegisterDto, 'courseCode' | 'year'>) {
    return this.authService.registerLecturer(dto);
  }
}