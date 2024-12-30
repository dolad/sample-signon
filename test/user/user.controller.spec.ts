import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/user/user.controller';
import { UserService } from '../../src/user/user.service';

describe('UserController', () => {
    let controller: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        findById: jest.fn().mockImplementation((id: string) => ({
                            id,
                            username: 'johndoe',
                            email: 'john.doe@example.com',
                            roles: ['user'],
                        })),
                        findByUsername: jest.fn().mockImplementation((username: string) => ({
                            id: 'user123',
                            username,
                            email: 'john.doe@example.com',
                            roles: ['user'],
                        })),
                    },
                },
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    it('should return user information by ID', () => {
        const user = controller.getUserInfo('user123');
        expect(user.id).toBe('user123');
        expect(user.username).toBe('johndoe');
    });

    it('should return user information by username', () => {
        const user = controller.getUserInfo(undefined, 'johndoe');
        expect(user.username).toBe('johndoe');
        expect(user.id).toBe('user123');
    });

    it('should throw an error if no ID or username is provided', () => {
        expect(() => controller.getUserInfo()).toThrow('Either id or username must be provided');
    });
});
