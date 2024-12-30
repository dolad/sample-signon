import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('token_example'),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should generate an authorization code', async () => {
        const clientId = 'client123';
        const authCode = await service.generateAuthorizationCode(clientId);

        expect(authCode).toBeDefined();
    });

    it('should validate a valid authorization code', async () => {
        const clientId = 'client123';
        const authCode = await service.generateAuthorizationCode(clientId);

        expect(service.validateAuthorizationCode(authCode)).toBe(true);
    });

    it('should generate tokens', async () => {
        const tokens = await service.generateTokens('client123');

        expect(tokens.access_token).toBe('token_example');
        expect(tokens.id_token).toBe('token_example');
    });
});
