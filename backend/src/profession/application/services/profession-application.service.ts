import {Injectable,Logger} from '@nestjs/common'
import {Profession} from '../../domain/entities/profession'
import {CreateProfessionUseCase} from '../use-cases/create-profession.use-case'
import {FindAllProfessionsUseCase} from '../use-cases/find-all-professions.use-case'
import {FindProfessionByIdUseCase} from '../use-cases/find-profession-by-id.use-case'

@Injectable()
export class ProfessionApplicationService {
    private readonly logger=new Logger(ProfessionApplicationService.name)

    constructor(
        private readonly createProfessionUseCase: CreateProfessionUseCase,
        private readonly findAllProfessionsUseCase: FindAllProfessionsUseCase,
        private readonly findProfessionByIdUseCase: FindProfessionByIdUseCase
    ) {
        this.logger.log('ProfessionApplicationService initialized')
    }

    async createProfession(profession: string): Promise<Profession> {
        this.logger.log(`Creating profession: ${profession}`)
        return this.createProfessionUseCase.execute(profession)
    }

    async getAllProfessions(): Promise<Profession[]> {
        this.logger.log('Getting all professions')
        return this.findAllProfessionsUseCase.execute()
    }

    async getProfessionById(id: string): Promise<Profession> {
        this.logger.log(`Getting profession by id: ${id}`)
        return this.findProfessionByIdUseCase.execute(id)
    }
}
