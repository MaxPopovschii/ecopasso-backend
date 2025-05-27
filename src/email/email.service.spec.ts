import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(() => {
    const mockMailer = { sendMail: jest.fn() };
    service = new EmailService(mockMailer as any);
    service['otps'].clear();
  });

  it('should generate and verify OTP', () => {
    const email = 'test@eco.com';
    const code = service.generateOtp(email);
    expect(service.verifyOtp(email, code)).toBe(true);
  });

  it('should fail with wrong OTP', () => {
    const email = 'test@eco.com';
    service.generateOtp(email);
    expect(service.verifyOtp(email, '000000')).toBe(false);
  });
});