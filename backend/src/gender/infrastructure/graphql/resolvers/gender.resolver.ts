import {Logger} from '@nestjs/common'
import {Args,Mutation,Query,Resolver} from '@nestjs/graphql'
import {GenderApplicationService} from '../../../application/services/gender-application.service'
import {CreateGenderInput} from '../../dtos/inputs/create-gender.input'
import {GenderModel} from '../../dtos/models/gender.model'
import {GenderGraphQLMapper} from '../mappers/gender-graphql.mapper'

@Resolver(() => GenderModel)
export class GenderResolver {
    private readonly logger=new Logger(GenderResolver.name)

    constructor(
        private readonly genderApplicationService: GenderApplicationService
    ) {
        this.logger.log('GenderResolver initialized')
    }

    @Query(() => [GenderModel])
    async genders(): Promise<GenderModel[]> {
        try {
            this.logger.log('Executing genders query')
            const genders=await this.genderApplicationService.getAllGenders()

            return GenderGraphQLMapper.toModelList(genders)
        } catch(error) {
            this.logger.error(`Error in genders query: ${error.message}`)
            throw error
        }
    }

    @Query(() => GenderModel)
    async gender(@Args('id') id: string): Promise<GenderModel> {
        try {
            this.logger.log(`Executing gender query with id: ${id}`)
            const gender=await this.genderApplicationService.getGenderById(id)

            return GenderGraphQLMapper.toModel(gender)
        } catch(error) {
            this.logger.error(`Error in gender query: ${error.message}`)
            throw error
        }
    }

    @Mutation(() => GenderModel)
    async createGender(@Args('input') input: CreateGenderInput): Promise<GenderModel> {
        try {
            this.logger.log(`Executing createGender mutation with input: ${JSON.stringify(input)}`)
            const gender=await this.genderApplicationService.createGender(input.gender)

            this.logger.log(`Successfully created gender with id: ${gender.id}`)
            return GenderGraphQLMapper.toModel(gender)
        } catch(error) {
            this.logger.error(`Error in createGender mutation: ${error.message}`,error.stack)
            throw error
        }
    }
}
