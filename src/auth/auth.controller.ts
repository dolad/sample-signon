import { Controller, Get, Post, Body, Query, Redirect, HttpException, HttpStatus, Inject, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService } from '../token/token.service';
import { AuthorizeRequestDto } from './dto/authorize-request.dto';
import { TokenRequestDto } from './dto/token-request.dto';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokenService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) { }

    /**
     * Authorization endpoint.
     * Generates an authorization code and redirects the user.
     */
    @Get('test')
    async test() {
        this.logger.info('Request recieved');
        return { body: "succesfully check" };
    }

    /**
     * Authorization endpoint.
     * Generates an authorization code and redirects the user.
     */
    @Get('authorize')
    @Redirect()
    async authorize(@Query() query: AuthorizeRequestDto) {
        this.logger.info('Request recieved');
        const authCode = await this.authService.generateAuthorizationCode(query.client_id);
        this.logger.info('Request handled successfully', { authCode });
        return { url: `${query.redirect_uri}?code=${authCode}&state=${query.state}` };
    }

    /**
     * Token endpoint.
     * Exchanges an authorization code for access and ID tokens.
     */
    @Post('token')
    async token(@Body() body: TokenRequestDto) {
        this.logger.info('Request Recieved');
        const isValidCode = this.authService.validateAuthorizationCode(body.code);
        if (!isValidCode) {
            throw new HttpException('Invalid authorization code', HttpStatus.UNAUTHORIZED);
        }

        const accessToken = this.tokenService.generateAccessToken(body.client_id, 'user123', ['user']);
        const idToken = this.tokenService.generateIdToken(body.client_id, 'user123');
        const refreshToken = this.tokenService.generateRefreshToken(body.client_id, 'user123');
        this.logger.info('Request handled successfully');
        return {
            access_token: accessToken,
            id_token: idToken,
            refresh_token: refreshToken,
            token_type: 'Bearer',
            expires_in: 3600,
        };
    }

    /**
     * Refresh token endpoint.
     * Issues a new access token using a valid refresh token.
     */
    @Post('refresh')
    async refresh(@Body('refresh_token') refreshToken: string) {
        try {
            const newAccessToken = this.tokenService.useRefreshToken(refreshToken);
            return {
                access_token: newAccessToken,
                token_type: 'Bearer',
                expires_in: 3600,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * Revoke token endpoint.
     * Revokes an access or refresh token.
     */
    @Post('revoke')
    async revoke(@Body('token') token: string) {
        try {
            this.tokenService.revokeToken(token);
            return { message: 'Token revoked successfully' };
        } catch (error) {
            throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
        }
    }
}
