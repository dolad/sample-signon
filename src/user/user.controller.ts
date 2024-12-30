import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('userinfo')
export class UserController {
    constructor(private readonly userService: UserService) { }

    /**
     * Retrieve user information by ID or username.
     * @param id - The user ID (optional).
     * @param username - The username (optional).
     * @returns The user object if found.
     */
    @Get()
    getUserInfo(@Query('id') id?: string, @Query('username') username?: string) {
        if (id) {
            return this.userService.findById(id);
        }
        if (username) {
            return this.userService.findByUsername(username);
        }
        throw new NotFoundException('Either id or username must be provided');
    }
}
