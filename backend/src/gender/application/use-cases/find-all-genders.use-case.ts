import {Inject,Injectable} from '@nestjs/common'
import {Gender} from '../../domain/entities/gender'
import {GenderRepositoryPort} from '../../domain/ports/gender-repository.port'
import {GENDER_REPOSITORY} from '../../domain/tokens'

export interface FindAllGendersResponse {
    genders: Gender[]
}

@Injectable()
export class FindAllGendersUseCase {
    constructor(
        @Inject(GENDER_REPOSITORY)
        private readonly genderRepository: GenderRepositoryPort
    ) {}

    async execute(): Promise<FindAllGendersResponse> {
        const genders=await this.genderRepository.findAll()
        return {genders}
    }
}
