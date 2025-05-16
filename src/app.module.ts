import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ActivitiesModule } from './activities/activities.module';
import { FootprintModule } from './footprint/footprint.module';
import { Activity } from './activities/entities/activity.entity';
import { ActivityType } from './activities/entities/activity-type.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      driver: require('mysql2'),
      host: process.env.DB_HOST ?? 'localhost',
      port: 3306,
      username: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASS ?? 'Dom200598!',
      database: process.env.DB_NAME ?? 'ecofootprint',
      entities: [Activity, ActivityType, User], // Add both entities here
      autoLoadEntities: true,
      synchronize: true, // disabilita in produzione!
    }),
    AuthModule,
    UsersModule,
    ActivitiesModule,
    FootprintModule,
  ],
})
export class AppModule {}