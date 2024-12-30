import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryController } from '../../src/discovery/discovery.controller';
import { DiscoveryService } from '../../src/discovery/discovery.service';

describe('DiscoveryController', () => {
    let controller: DiscoveryController;
    let service: DiscoveryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DiscoveryController],
            providers: [
                {
                    provide: DiscoveryService,
                    useValue: {
                        getOpenIdConfiguration: jest.fn().mockReturnValue({
                            issuer: 'https://my-custom-idp.com',
                            authorization_endpoint: 'https://my-custom-idp.com/auth/authorize',
                            token_endpoint: 'https://my-custom-idp.com/auth/token',
                        }),
                    },
                },
            ],
        }).compile();

        controller = module.get<DiscoveryController>(DiscoveryController);
        service = module.get<DiscoveryService>(DiscoveryService);
    });

    it('should return OpenID Connect configuration', () => {
        const config = controller.getOpenIdConfiguration();
        expect(config.issuer).toBe('https://my-custom-idp.com');
        expect(config.authorization_endpoint).toBe('https://my-custom-idp.com/auth/authorize');
        expect(config.token_endpoint).toBe('https://my-custom-idp.com/auth/token');
    });
});
