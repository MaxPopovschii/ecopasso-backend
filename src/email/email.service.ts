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
        html: `
          <div style="font-family: Arial, sans-serif; background: #f6f6f6; padding: 24px;">
            <div style="max-width: 420px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 32px;">
              <h2 style="color: #2e7d32; text-align: center;">Codice OTP EcoPasso</h2>
              <p style="font-size: 16px; color: #333; text-align: center;">
                Usa questo codice per completare la tua operazione:
              </p>
              <div style="font-size: 32px; color: #388e3c; font-weight: bold; letter-spacing: 4px; text-align: center; margin: 24px 0;">
                ${code}
              </div>
              <p style="font-size: 14px; color: #888; text-align: center;">
                Il codice scade tra 5 minuti.<br>
                Se non hai richiesto questo codice, ignora questa email.
              </p>
              <p style="font-size: 12px; color: #bbb; text-align: center; margin-top: 32px;">
                &copy; ${new Date().getFullYear()} EcoPasso
              </p>
            </div>
          </div>
        `,
      });
      return { success: true };
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return { success: false, error };
    }
  }
}

