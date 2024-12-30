import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { readFileSync } from 'fs';
import { join } from 'path';

const publicKeyPath = join(__dirname, '../../../public.key'); // Adjust the number of `../` based on actual structure
const publicKey = readFileSync(publicKeyPath, 'utf8');


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: publicKey
        });

        if (!publicKey) {
            throw new Error('JWT_PUBLIC_KEY must be defined');
        }
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}
