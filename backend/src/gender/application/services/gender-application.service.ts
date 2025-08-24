import {Injectable} from '@nestjs/common'
import {Gender,GenderType} from '../../domain/entities/gender'
import {CreateGenderUseCase} from '../use-cases/create-gender.use-case'
import {FindAllGendersUseCase} from '../use-cases/find-all-genders.use-case'
import {FindGenderByIdUseCase} from '../use-cases/find-gender-by-id.use-case'

@Injectable()
export class GenderApplicationService {
    constructor(
        private readonly createGenderUseCase: CreateGenderUseCase,
        private readonly findAllGendersUseCase: FindAllGendersUseCase,
        private readonly findGenderByIdUseCase: FindGenderByIdUseCase
    ) {}

    async createGender(gender: string): Promise<Gender> {
        const result=await this.createGenderUseCase.execute({gender})
        return result.gender
    }

    async getAllGenders(): Promise<Gender[]> {
        const result=await this.findAllGendersUseCase.execute()
        return result.genders
    }

    async getGenderById(id: string): Promise<Gender> {
        const result=await this.findGenderByIdUseCase.execute({id})
        return result.gender
    }
}
