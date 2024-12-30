import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { TokenService } from '../../src/token/token.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;
    let tokenService: TokenService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        generateAuthorizationCode: jest.fn().mockResolvedValue('auth_code_example'),
                        validateAuthorizationCode: jest.fn().mockReturnValue(true),
                    },
                },
                {
                    provide: TokenService,
                    useValue: {
                        generateAccessToken: jest.fn().mockReturnValue('access_token_example'),
                        generateIdToken: jest.fn().mockReturnValue('id_token_example'),
                        generateRefreshToken: jest.fn().mockReturnValue('refresh_token_example'),
                        useRefreshToken: jest.fn().mockReturnValue('new_access_token_example'),
                        revokeToken: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        tokenService = module.get<TokenService>(TokenService);
    });

    it('should generate an authorization code and redirect', async () => {
        const result = await controller.authorize({
            client_id: 'client123',
            redirect_uri: 'https://example.com/callback',
            response_type: 'code',
            scope: 'openid',
            state: 'abc',
        });

        expect(result.url).toBe('https://example.com/callback?code=auth_code_example&state=abc');
        expect(authService.generateAuthorizationCode).toHaveBeenCalledWith('client123');
    });

    it('should exchange an authorization code for tokens', async () => {
        const result = await controller.token({
            code: 'auth_code_example',
            client_id: 'client123',
            client_secret: 'secret',
            redirect_uri: 'https://example.com/callback',
            grant_type: 'authorization_code',
        });

        expect(result.access_token).toBe('access_token_example');
        expect(result.id_token).toBe('id_token_example');
        expect(result.refresh_token).toBe('refresh_token_example');
        expect(result.token_type).toBe('Bearer');
        expect(result.expires_in).toBe(3600);
        expect(authService.validateAuthorizationCode).toHaveBeenCalledWith('auth_code_example');
    });

    it('should throw an error for an invalid authorization code', async () => {
        jest.spyOn(authService, 'validateAuthorizationCode').mockReturnValue(false);

        await expect(
            controller.token({
                code: 'invalid_code',
                client_id: 'client123',
                client_secret: 'secret',
                redirect_uri: 'https://example.com/callback',
                grant_type: 'authorization_code',
            }),
        ).rejects.toThrow(new HttpException('Invalid authorization code', HttpStatus.UNAUTHORIZED));
    });

    it('should refresh a token using a valid refresh token', async () => {
        const result = await controller.refresh('refresh_token_example');

        expect(result.access_token).toBe('new_access_token_example');
        expect(result.token_type).toBe('Bearer');
        expect(result.expires_in).toBe(3600);
        expect(tokenService.useRefreshToken).toHaveBeenCalledWith('refresh_token_example');
    });

    it('should throw an error for an invalid refresh token', async () => {
        jest.spyOn(tokenService, 'useRefreshToken').mockImplementation(() => {
            throw new Error('Refresh token not found or expired');
        });

        await expect(controller.refresh('invalid_refresh_token')).rejects.toThrow(
            new HttpException('Refresh token not found or expired', HttpStatus.UNAUTHORIZED),
        );
    });

    it('should revoke a token successfully', async () => {
        const result = await controller.revoke('access_token_example');

        expect(result.message).toBe('Token revoked successfully');
        expect(tokenService.revokeToken).toHaveBeenCalledWith('access_token_example');
    });

    it('should throw an error for invalid token revocation', async () => {
        jest.spyOn(tokenService, 'revokeToken').mockImplementation(() => {
            throw new Error('Invalid token');
        });

        await expect(controller.revoke('invalid_token')).rejects.toThrow(
            new HttpException('Invalid token', HttpStatus.BAD_REQUEST),
        );
    });
});
