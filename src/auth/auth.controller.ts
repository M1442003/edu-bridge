import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }


  @Post('register/bulk')
  async registerBulk(@Body() users: CreateUserDto[]) {
    if (!Array.isArray(users) || users.length === 0) {
      throw new BadRequestException('Users array is required');
    }
    
    const results: { success: boolean; email: string; id?: number; error?: string }[] = [];

    for (const user of users) {
      try {
        const created = await this.authService.register(user);
        results.push({ success: true, email: user.email, id: created.id });
      } catch (error: any) {
        results.push({ success: false, email: user.email, error: error.message });
      }
    }

    return { message: `${results.length} users processed`, results };
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
