import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailService } from '../email/email.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<string> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const loginResult = await this.authService.login(user);
    await this.usersService.updateLastAccess(loginDto.email);
    return loginResult.access_token;
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP verified successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid or expired OTP',
  })
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    const { email, otp } = body;
    const isValid = this.emailService.verifyOtp(email, otp);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    return { message: 'OTP verified successfully' };
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Registration failed',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create({
        name: createUserDto.name,
        surname: createUserDto.surname,
        email: createUserDto.email,
        password: createUserDto.password
      });
      return { message: 'User registered successfully', user };
    } catch (err) {
      if (err instanceof ConflictException) {
        throw err;
      }
      throw new BadRequestException('Registration failed');
    }
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    await this.authService.sendPasswordReset(body.email);
    return { message: 'Tra poco riceverai un link per il reset.' };
  }

  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body() body: { email: string; password: string; token: string },
  ) {
    const { email, password, token } = body;
    if (!email || !password || !token) {
      throw new BadRequestException('Email, password, and token are required');
    }
    await this.authService.resetPassword(email, token, password);
    return { message: 'Password reset successfully' };
  }

}

