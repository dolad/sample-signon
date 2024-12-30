import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from '../../src/token/token.service';
import { mockPrivateKey, mockPublicKeys } from './keys/mockPrivateTest'

describe('TokenService', () => {
    let service: TokenService;


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    privateKey: mockPrivateKey,
                    publicKey: mockPublicKeys,
                    signOptions: { algorithm: 'RS256', expiresIn: '1h' },
                }),
            ],
            providers: [TokenService],
        }).compile();

        service = module.get<TokenService>(TokenService);
    });

    it('should generate a valid access token with roles', () => {
        const token = service.generateAccessToken('client123', 'user123', ['admin', 'editor']);
        expect(token).toBeDefined();
    });

    it('should generate a valid refresh token', () => {
        const refreshToken = service.generateRefreshToken('client123', 'user123');
        expect(refreshToken).toBeDefined();
    });

    it('should verify a valid token', () => {
        const token = service.generateAccessToken('client123', 'user123', ['user']);
        const payload = service.verifyToken(token);
        expect(payload.sub).toBe('user123');
        expect(payload.roles).toContain('user');
    });

    it('should revoke a token and prevent its use', () => {
        const token = service.generateAccessToken('client123', 'user123', ['user']);
        service.revokeToken(token);
        expect(() => service.verifyToken(token)).toThrow('Token has been revoked');
    });

    it('should generate a new access token using a refresh token', () => {
        const refreshToken = service.generateRefreshToken('client123', 'user123');
        const newAccessToken = service.useRefreshToken(refreshToken);
        expect(newAccessToken).toBeDefined();
    });

    it('should throw an error for invalid refresh tokens', () => {
        expect(() => service.useRefreshToken('invalid-token')).toThrow('jwt malformed');
    });
});
