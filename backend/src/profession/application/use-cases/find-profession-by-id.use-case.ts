import {Inject,Injectable,Logger} from '@nestjs/common'
import {Profession} from '../../domain/entities/profession'
import {ProfessionNotFoundException} from '../../domain/exceptions/profession-domain.exception'
import {ProfessionRepositoryPort} from '../../domain/ports/profession-repository.port'
import {PROFESSION_REPOSITORY} from '../../domain/tokens'

@Injectable()
export class FindProfessionByIdUseCase {
    private readonly logger=new Logger(FindProfessionByIdUseCase.name)

    constructor(
        @Inject(PROFESSION_REPOSITORY)
        private readonly professionRepository: ProfessionRepositoryPort
    ) {
        this.logger.log('FindProfessionByIdUseCase initialized')
    }

    async execute(id: string): Promise<Profession> {
        try {
            this.logger.log(`Executing FindProfessionByIdUseCase with id: ${id}`)
            const profession=await this.professionRepository.findById(id)

            if(!profession) {
                throw new ProfessionNotFoundException(id)
            }

            this.logger.log(`Found profession with id: ${id}`)
            return profession
        } catch(error) {
            this.logger.error(`Error in FindProfessionByIdUseCase: ${error.message}`)
            throw error
        }
    }
}
