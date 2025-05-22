import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailer: MailerService) {}
  private readonly otps: Map<string, { code: string; expiresAt: Date }> = new Map();

  generateOtp(email: string): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    this.otps.set(email, { code, expiresAt });
    return code;
  }

  verifyOtp(email: string, inputCode: string): boolean {
    const record = this.otps.get(email);
    if (!record) return false;

    const { code, expiresAt } = record;
    if (new Date() > expiresAt) {
      this.otps.delete(email);
      return false;
    }

    const isValid = code === inputCode;
    if (isValid) this.otps.delete(email);
    return isValid;
  }

  async sendOtp(email: string) {
    const code = this.generateOtp(email);
    try {
      await this.mailer.sendMail({
        to: email,
        subject: 'Il tuo codice OTP',
        text: `Il tuo codice OTP è: ${code}`,
        html: `<p>Il tuo codice OTP è: <b>${code}</b></p>`,
      });
      return { success: true };
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return { success: false, error };
    }
  }
}

