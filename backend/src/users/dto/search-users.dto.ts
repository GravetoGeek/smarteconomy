import {Type} from 'class-transformer'
import {IsIn,IsInt,IsOptional,IsString,Max,Min} from 'class-validator'

export class SearchUsersDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number=1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number=10;

    @IsOptional()
    @IsString()
    filter?: string

    @IsOptional()
    @IsString()
    sort?: string

    @IsOptional()
    @IsIn(['asc','desc'])
    sortDirection?: 'asc'|'desc'='asc';
}
