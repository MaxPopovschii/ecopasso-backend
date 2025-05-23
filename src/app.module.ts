import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesModule } from './activities/activities.module';
import { ActivityCategory } from './activities/entities/activity-category.entity';
import { ActivityData } from './activities/entities/activity-data.entity';
import { ActivityType } from './activities/entities/activity-type.entity';
import { Activity } from './activities/entities/activity.entity';
import { AuthModule } from './auth/auth.module';
import { BadgesModule } from './badges/badges.module';
import { EmailNotificatorModule } from './email-notificator/email-notificator.module';
import { EmailModule } from './email/email.module';
import { FootprintModule } from './footprint/footprint.module';
import { GoalsModule } from './goals/goals.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 100,
        }
      ]
    }),
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
      entities: [Activity, ActivityCategory, ActivityData, ActivityType, User],
      autoLoadEntities: true,
      synchronize: false, 
      logging: true,
    }),
    AuthModule,
    UsersModule,
    ActivitiesModule,
    FootprintModule,
    EmailModule,
    EmailNotificatorModule,
    BadgesModule,
    GoalsModule,
    LeaderboardModule,
  ],
})
export class AppModule {}