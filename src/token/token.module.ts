import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
    imports: [
        JwtModule.register({
            privateKey: process.env.JWT_PRIVATE_KEY,
            publicKey: process.env.JWT_PUBLIC_KEY,
            signOptions: {
                algorithm: 'RS256',
                expiresIn: process.env.JWT_EXPIRATION,
            },
        }),
    ],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule { }
