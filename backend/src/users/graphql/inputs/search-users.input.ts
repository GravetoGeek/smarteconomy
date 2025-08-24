import {Field,InputType,Int} from '@nestjs/graphql'
import {IsIn,IsInt,IsOptional,IsString,Max,Min} from 'class-validator'

@InputType()
export class SearchUsersInput {
    @Field(() => Int,{nullable: true})
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number=1;

    @Field(() => Int,{nullable: true})
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number=10;

    @Field({nullable: true})
    @IsOptional()
    @IsString()
    filter?: string

    @Field({nullable: true})
    @IsOptional()
    @IsString()
    sort?: string

    @Field({nullable: true})
    @IsOptional()
    @IsIn(['asc','desc'])
    sortDirection?: 'asc'|'desc'='asc';
}
