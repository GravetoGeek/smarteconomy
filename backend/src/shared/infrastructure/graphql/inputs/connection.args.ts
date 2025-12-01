import {ArgsType,Field,Int} from '@nestjs/graphql'
import {IsInt,IsOptional,IsString,Min} from 'class-validator'

@ArgsType()
export class ConnectionArgs {
    @Field(() => Int,{nullable: true})
    @IsOptional()
    @IsInt()
    @Min(1)
    first?: number

    @Field(() => String,{nullable: true})
    @IsOptional()
    @IsString()
    after?: string

    @Field(() => Int,{nullable: true})
    @IsOptional()
    @IsInt()
    @Min(1)
    last?: number

    @Field(() => String,{nullable: true})
    @IsOptional()
    @IsString()
    before?: string

    @Field({nullable: true})
    @IsOptional()
    @IsString()
    filter?: string
}
