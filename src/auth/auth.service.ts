import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailer: MailerService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async sendPasswordReset(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return;

    // Crea un token JWT con email e scadenza breve (es: 1 ora)
    const token = await this.jwtService.signAsync(
      { email, type: 'reset' },
      { expiresIn: '1h' }
    );

    await this.mailer.sendMail({
      to: email,
      subject: 'EcoPasso - Recupero password',
      text: `Clicca qui per reimpostare la password: https://localhost:3000/reset-password?token=${token}&email=${email}`,
    });
  }
  
  async resetPassword(email: string, token: string, newPassword: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (payload.email !== email || payload.type !== 'reset') {
        throw new Error('Token non valido');
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      await this.usersService.update(email, { password: hashed });
    } catch (e: any) {
      if (e.name === 'TokenExpiredError' || e.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token non valido o scaduto');
      }
      throw e;
    }
  }
}