import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesModule } from './activities/activities.module';
import { ActivityType } from './activities/entities/activity-type.entity';
import { Activity } from './activities/entities/activity.entity';
import { AuthModule } from './auth/auth.module';
import { FootprintModule } from './footprint/footprint.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailNotificatorModule } from './email-notificator/email-notificator.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', 
        port: 587,
        secure: false,
        auth: {
          user: 'giocrew09@gmail.com',
          pass: 'pvidmrvypekeiayu', 
        },
        tls: {
      rejectUnauthorized: false,  
    },
      },
      defaults: {
        from: '"EcoPasso" <no-reply@ecopasso.com>',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      driver: require('mysql2'),
      host: process.env.DB_HOST ?? 'localhost',
      port: 3306,
      username: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASS ?? 'Dom200598!',
      database: process.env.DB_NAME ?? 'ecofootprint',
      entities: [Activity, ActivityType, User], 
      autoLoadEntities: true,
      synchronize: false, 
    }),
    AuthModule,
    UsersModule,
    ActivitiesModule,
    FootprintModule,
    EmailModule,
    EmailNotificatorModule,
  ],
})
export class AppModule {}