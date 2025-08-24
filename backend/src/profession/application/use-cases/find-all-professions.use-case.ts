import {Inject,Injectable,Logger} from '@nestjs/common'
import {Profession} from '../../domain/entities/profession'
import {ProfessionRepositoryPort} from '../../domain/ports/profession-repository.port'
import {PROFESSION_REPOSITORY} from '../../domain/tokens'

@Injectable()
export class FindAllProfessionsUseCase {
    private readonly logger=new Logger(FindAllProfessionsUseCase.name)

    constructor(
        @Inject(PROFESSION_REPOSITORY)
        private readonly professionRepository: ProfessionRepositoryPort
    ) {
        this.logger.log('FindAllProfessionsUseCase initialized')
    }

    async execute(): Promise<Profession[]> {
        try {
            this.logger.log('Executing FindAllProfessionsUseCase')
            const professions=await this.professionRepository.findAll()
            this.logger.log(`Found ${professions.length} professions`)
            return professions
        } catch(error) {
            this.logger.error(`Error in FindAllProfessionsUseCase: ${error.message}`)
            throw error
        }
    }
}
