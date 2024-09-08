import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto/update-user.dto';
import {UserEntity} from './entities/user.entity/user.entity';

@Injectable()
export class UsersService {
    private readonly users: UserEntity[] = [
        {id:1, email:'edusrm11@gmail.com', password:'123456', created_at:Date.now(), updated_at:Date.now()},
        {id:2, email:'glorinha@gmail.com', password:'123456', created_at:Date.now(), updated_at:Date.now()},
        {id:3, email:'teste1@gmail.com', password:'123456', created_at:Date.now(), updated_at:Date.now()},
        {id:4, email:'teste2@gmail.com', password:'123456', created_at:Date.now(), updated_at:Date.now()},
        {id:5, email:'teste3@gmail.com', password:'123456', created_at:Date.now(), updated_at:Date.now()}
    ]

    async findAll(): Promise<UserEntity[]> {
        return this.users
    }

    async findOne(id: string): Promise<UserEntity> {
        return this.users.find(user => user.id === Number(id))
    }

    async create(userDto: CreateUserDto): Promise<CreateUserDto> {
        const user = new UserEntity()
        user.email = userDto.email
        user.password = userDto.password
        user.created_at = Date.now()
        user.updated_at = Date.now()
        user.id = this.users.length + 1
        this.users.push(user)
        console.log({user})
        return user
    }

    async update(id: number, user: UpdateUserDto): Promise<UpdateUserDto> {
        const index = this.users.findIndex(user => user.id === id)
        this.users[index] = user
        return user
    }

    async remove(id: number): Promise<void> {
        const index = this.users.findIndex(user => user.id === id)
        this.users.splice(index, 1)
    }

    async findByEmail(email: string): Promise<UserEntity> {
        return this.users.find(user => user.email === email)
    }



}
