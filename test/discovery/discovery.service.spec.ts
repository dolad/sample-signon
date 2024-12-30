import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryService } from '../../src/discovery/discovery.service';

describe.skip('DiscoveryService', () => {
    let service: DiscoveryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DiscoveryService],
        }).compile();

        service = module.get<DiscoveryService>(DiscoveryService);
    });

    it('should return OpenID Connect configuration', () => {
        const config = service.getOpenIdConfiguration();

        expect(config.issuer).toBeDefined();
        expect(config.authorization_endpoint).toContain('/auth/authorize');
        expect(config.token_endpoint).toContain('/auth/token');
        expect(config.userinfo_endpoint).toContain('/userinfo');
        expect(config.jwks_uri).toContain('/.well-known/jwks.json');
        expect(config.response_types_supported).toEqual(expect.arrayContaining(['code', 'token id_token']));
        expect(config.grant_types_supported).toEqual(expect.arrayContaining(['authorization_code', 'implicit', 'refresh_token']));
    });
});
