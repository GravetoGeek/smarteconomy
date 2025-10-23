import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator'

@InputType()
export class CreateCategoryInput {
    @Field()
    @IsNotEmpty({ message: 'Category name is required' })
    @IsString({ message: 'Category name must be a string' })
    @MinLength(2, { message: 'Category name must be at least 2 characters long' })
    @MaxLength(100, { message: 'Category name must not exceed 100 characters' })
    category: string
}
