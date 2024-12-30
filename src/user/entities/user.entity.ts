export class User {
    id: string;
    username: string;
    email: string;
    roles: string[];
    password?: string; // Only for internal usage, not exposed via APIs

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
