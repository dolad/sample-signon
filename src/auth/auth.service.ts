import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
    private authorizationCodes = new Map<string, string>(); // Auth codes storage (clientId -> authCode)

    constructor(private readonly jwtService: JwtService) { }

    async generateAuthorizationCode(clientId: string): Promise<string> {
        const authCode = randomBytes(16).toString('hex'); // Generate a random auth code
        this.authorizationCodes.set(authCode, clientId); // Store in memory
        return authCode;
    }

    validateAuthorizationCode(code: string): boolean {
        return this.authorizationCodes.has(code);
    }

    async generateTokens(clientId: string): Promise<{ access_token: string; id_token: string; expires_in: number }> {
        const payload = { sub: clientId, scope: 'openid profile email' };
        const accessToken = this.jwtService.sign(payload);
        const idToken = this.jwtService.sign({ ...payload, aud: clientId });
        return {
            access_token: accessToken,
            id_token: idToken,
            expires_in: 3600, // Hardcoded expiration for simplicity
        };
    }
}
