import {User} from "../graphql/models/User";
import {ICreateUser} from "./create-user";

export interface SearchParams {
    page: number;
    limit: number;
    filter?: string;
    sort?: string;
    sortDirection?: 'asc'|'desc';
}
export interface SearchResult {
    items: User[];
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
    lastPage: number;

}
export interface IUsersRepository {
    sortableFields: string[];
    findByEmail(email: string): Promise<User>;
    create(user: ICreateUser): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<User>;
    findById(id: string): Promise<User>;
    findAll(): Promise<User[]>;
    get(id: string): Promise<User>;
    search(search: SearchParams): Promise<SearchResult>;
}
