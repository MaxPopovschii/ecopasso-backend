import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ActivitiesModule } from './activities/activities.module';
import { FootprintModule } from './footprint/footprint.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'ecopasso',
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