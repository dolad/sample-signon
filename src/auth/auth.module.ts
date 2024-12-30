import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenModule } from 'src/token/token.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
    imports: [
        PassportModule,
        TokenModule,
        LoggerModule,
        JwtModule.register({
            privateKey: process.env.JWT_PRIVATE_KEY,
            publicKey: process.env.JWT_PUBLIC_KEY,
            signOptions: {
                algorithm: 'RS256',
                expiresIn: process.env.JWT_EXPIRATION,
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule { }
