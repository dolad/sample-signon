import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { UserModule } from './user/user.module';
import { LoggerModule } from './logger/logger.module'; // Ensure path is correct
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, LoggerModule, TokenModule, DiscoveryModule, UserModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env', // This makes the config globally available in your app
  }),],
})
export class AppModule { }
