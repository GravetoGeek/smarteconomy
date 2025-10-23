import {Logger} from '@nestjs/common'
import {Args,Mutation,Query,Resolver} from '@nestjs/graphql'
import {ProfessionApplicationService} from '../../../application/services/profession-application.service'
import {CreateProfessionInput} from '../../dtos/inputs/create-profession.input'
import {ProfessionModel} from '../../dtos/models/profession.model'
import {ProfessionGraphQLMapper} from '../mappers/profession-graphql.mapper'

@Resolver(() => ProfessionModel)
export class ProfessionResolver {
    private readonly logger=new Logger(ProfessionResolver.name)

    constructor(
        private readonly professionApplicationService: ProfessionApplicationService
    ) {
        this.logger.log('ProfessionResolver initialized')
    }

    @Query(() => [ProfessionModel])
    async professions(): Promise<ProfessionModel[]> {
        try {
            this.logger.log('Executing professions query')
            const professions=await this.professionApplicationService.getAllProfessions()

            return ProfessionGraphQLMapper.toModelList(professions)
        } catch(error) {
            this.logger.error(`Error in professions query: ${error.message}`)
            throw error
        }
    }

    @Query(() => ProfessionModel)
    async profession(@Args('id') id: string): Promise<ProfessionModel> {
        try {
            this.logger.log(`Executing profession query with id: ${id}`)
            const profession=await this.professionApplicationService.getProfessionById(id)

            return ProfessionGraphQLMapper.toModel(profession)
        } catch(error) {
            this.logger.error(`Error in profession query: ${error.message}`)
            throw error
        }
    }

    @Mutation(() => ProfessionModel)
    async createProfession(@Args('input') input: CreateProfessionInput): Promise<ProfessionModel> {
        try {
            this.logger.log(`Executing createProfession mutation with input: ${JSON.stringify(input)}`)
            const profession=await this.professionApplicationService.createProfession(input.profession)

            this.logger.log(`Successfully created profession with id: ${profession.id}`)
            return ProfessionGraphQLMapper.toModel(profession)
        } catch(error) {
            this.logger.error(`Error in createProfession mutation: ${error.message}`,error.stack)
            throw error
        }
    }
}
