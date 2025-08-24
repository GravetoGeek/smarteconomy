import {Inject,Injectable} from '@nestjs/common'
import {Gender} from '../../domain/entities/gender'
import {GenderNotFoundException} from '../../domain/exceptions/gender-domain.exception'
import {GenderRepositoryPort} from '../../domain/ports/gender-repository.port'
import {GENDER_REPOSITORY} from '../../domain/tokens'

export interface FindGenderByIdRequest {
    id: string
}

export interface FindGenderByIdResponse {
    gender: Gender
}

@Injectable()
export class FindGenderByIdUseCase {
    constructor(
        @Inject(GENDER_REPOSITORY)
        private readonly genderRepository: GenderRepositoryPort
    ) {}

    async execute(request: FindGenderByIdRequest): Promise<FindGenderByIdResponse> {
        const gender=await this.genderRepository.findById(request.id)

        if(!gender) {
            throw new GenderNotFoundException(request.id)
        }

        return {gender}
    }
}
