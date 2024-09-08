import {Body,Controller,Delete,Get,Param,Patch,Post} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto/update-user.dto';
import {UsersService} from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(){
        return this.usersService.findAll()
    }

    @Get('id/:id')
    findOne(@Param('id') id:string){
        console.log({id})
        return this.usersService.findOne(id)
    }

    @Get('email/:email')
    findByEmail(@Param('email') email:string){
        return this.usersService.findByEmail(email)
    }

    @Post()
    create(@Body() user:CreateUserDto){
        return this.usersService.create(user)
    }

    @Patch(':id')
    update(id:number,user:UpdateUserDto){
        return this.usersService.update(id,user)
    }

    @Delete(':id')
    remove(id:number){
        return this.usersService.remove(id)
    }
}
