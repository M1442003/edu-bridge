import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { ClassEntity } from '../classes/class.entity';
import { Module as CourseModule } from '../modules/module.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Course,
      ClassEntity,
      CourseModule,
    ]),
    JwtModule.register({
      secret: 'your_jwt_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
