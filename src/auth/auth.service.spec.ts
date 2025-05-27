import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token'),
            verifyAsync: jest.fn().mockResolvedValue({ email: 'test@eco.com', type: 'reset' }),
          },
        },
        {
          provide: 'UsersService',
          useValue: {
            findByEmail: jest.fn().mockResolvedValue({ email: 'test@eco.com' }),
            update: jest.fn(),
          },
        },
        {
          provide: 'MailerService',
          useValue: { sendMail: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should send password reset email', async () => {
    await expect(service.sendPasswordReset('test@eco.com')).resolves.not.toThrow();
  });

  it('should reset password with valid token', async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed');
    await expect(service.resetPassword('test@eco.com', 'token', 'newpass')).resolves.not.toThrow();
  });

  it('should throw on invalid token', async () => {
    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('Invalid'));
    await expect(service.resetPassword('test@eco.com', 'badtoken', 'newpass')).rejects.toThrow();
  });
});