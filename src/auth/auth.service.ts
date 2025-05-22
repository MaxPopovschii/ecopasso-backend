import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
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
    if (!user) return; // Non rivelare se l'email esiste

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 ora

    /*
    await this.usersService.update(email, {
      reset_password_token: token,
      reset_password_expires: expires,
    });
    */  
    await this.mailer.sendMail({
      to: email,
      subject: 'EcoPasso - Recupero password',
      text: `Clicca qui per reimpostare la password: https://localhost:3000/reset-password?token=${token}&email=${email}`,
    });
  }
    /*
    async resetPassword(email: string, token: string, newPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (
      !user ||
      user.reset_password_token !== token ||
      !user.reset_password_expires ||
      user.reset_password_expires < new Date()
    ) {
      throw new Error('Token non valido o scaduto');
    }
    await this.usersService.update(email, {
      password: newPassword, // Ricordati di hashare!
      reset_password_token: null,
      reset_password_expires: null,
    });
  }
  */
}