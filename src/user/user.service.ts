import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    private readonly users: User[] = [
        new User({ id: 'user123', username: 'johndoe', email: 'john.doe@example.com', roles: ['user'] }),
        new User({ id: 'admin123', username: 'admin', email: 'admin@example.com', roles: ['admin'] }),
    ];

    /**
     * Find a user by ID.
     * @param id - The user ID.
     * @returns The user object if found.
     */
    findById(id: string): User {
        const user = this.users.find((user) => user.id === id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    /**
     * Find a user by username.
     * @param username - The username.
     * @returns The user object if found.
     */
    findByUsername(username: string): User {
        const user = this.users.find((user) => user.username === username);
        if (!user) {
            throw new NotFoundException(`User with username ${username} not found`);
        }
        return user;
    }

    /**
     * Get all users.
     * @returns An array of all user objects.
     */
    findAll(): User[] {
        return this.users;
    }
}
