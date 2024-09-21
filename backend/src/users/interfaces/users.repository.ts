import {User} from "../graphql/models/User";

export interface IUsersRepository {
    findByEmail(email: string): Promise<User>;
    save(user: any): Promise<User>;
    update(user: any): Promise<User>;
    delete(id: string): Promise<User>;
    findById(id: string): Promise<User>;
    findAll(): Promise<User[]>;
    get(id: string): Promise<User>;
}
