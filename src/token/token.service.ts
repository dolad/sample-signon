import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
    private revokedTokens = new Set<string>(); // Simulated in-memory store for revoked tokens
    private refreshTokenStore = new Map<string, { clientId: string; userId: string }>(); // In-memory refresh token store

    constructor(private readonly jwtService: JwtService) { }

    /**
     * Generate an access token with custom claims.
     * @param clientId - The client ID.
     * @param userId - The user ID.
     * @param roles - User roles or permissions.
     * @returns The generated access token.
     */
    generateAccessToken(clientId: string, userId: string, roles: string[]): string {
        const payload = { sub: userId, aud: clientId, roles, scope: 'openid profile email' };
        return this.jwtService.sign(payload);
    }

    /**
     * Generate an ID token.
     * @param clientId - The client ID.
     * @param userId - The user ID.
     * @returns The generated ID token.
     */
    generateIdToken(clientId: string, userId: string): string {
        const payload = { sub: userId, aud: clientId, iss: process.env.ISSUER };
        return this.jwtService.sign(payload);
    }

    /**
     * Generate a refresh token.
     * @param clientId - The client ID.
     * @param userId - The user ID.
     * @returns The generated refresh token.
     */
    generateRefreshToken(clientId: string, userId: string): string {
        const refreshToken = this.jwtService.sign(
            { sub: userId, aud: clientId, type: 'refresh' },
            { expiresIn: '7d' }, // 7-day expiration
        );
        this.refreshTokenStore.set(refreshToken, { clientId, userId });
        return refreshToken;
    }

    /**
     * Verify a token and check if it's revoked.
     * @param token - The JWT token to verify.
     * @returns The decoded token payload.
     */
    verifyToken(token: string): any {
        if (this.revokedTokens.has(token)) {
            throw new Error('Token has been revoked');
        }

        return this.jwtService.verify(token, {
            secret: process.env.JWT_PUBLIC_KEY,
            algorithms: ['RS256'],
        });
    }

    /**
     * Revoke a token.
     * @param token - The JWT token to revoke.
     */
    revokeToken(token: string): void {
        this.revokedTokens.add(token);
    }

    /**
     * Use a refresh token to generate a new access token.
     * @param refreshToken - The refresh token.
     * @returns A new access token.
     */
    useRefreshToken(refreshToken: string): string {
        const decoded = this.jwtService.verify(refreshToken, {
            secret: process.env.JWT_PUBLIC_KEY,
            algorithms: ['RS256'],
        });

        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }

        const tokenData = this.refreshTokenStore.get(refreshToken);
        if (!tokenData) {
            throw new Error('Refresh token not found or expired');
        }

        return this.generateAccessToken(tokenData.clientId, tokenData.userId, ['user']);
    }
}
