import { Injectable } from '@nestjs/common';

@Injectable()
export class DiscoveryService {
    getOpenIdConfiguration() {
        return {
            issuer: process.env.ISSUER,
            authorization_endpoint: `${process.env.ISSUER}/auth/authorize`,
            token_endpoint: `${process.env.ISSUER}/auth/token`,
            userinfo_endpoint: `${process.env.ISSUER}/userinfo`,
            jwks_uri: `${process.env.ISSUER}/.well-known/jwks.json`,
            response_types_supported: ['code', 'token id_token'],
            grant_types_supported: ['authorization_code', 'implicit', 'refresh_token'],
            scopes_supported: ['openid', 'profile', 'email'],
            subject_types_supported: ['public'],
            id_token_signing_alg_values_supported: ['RS256'],
        };
    }
}
