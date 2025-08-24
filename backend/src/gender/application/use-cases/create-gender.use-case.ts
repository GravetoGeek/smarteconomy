import {Inject,Injectable,Logger} from '@nestjs/common'
import {Gender,GenderType} from '../../domain/entities/gender'
import {GenderAlreadyExistsException,InvalidGenderTypeException} from '../../domain/exceptions/gender-domain.exception'
import {GenderRepositoryPort} from '../../domain/ports/gender-repository.port'
import {GENDER_REPOSITORY} from '../../domain/tokens'

export interface CreateGenderRequest {
    gender: string
}

export interface CreateGenderResponse {
    gender: Gender
}

@Injectable()
export class CreateGenderUseCase {
    private readonly logger=new Logger(CreateGenderUseCase.name)

    constructor(
        @Inject(GENDER_REPOSITORY)
        private readonly genderRepository: GenderRepositoryPort
    ) {}

    async execute(request: CreateGenderRequest): Promise<CreateGenderResponse> {
        try {
            this.logger.log(`Executing CreateGenderUseCase with input: ${request.gender}`)

            // Validate and convert gender string to enum
            const genderType=this.validateAndConvertGender(request.gender)
            this.logger.log(`Converted gender string to enum: ${genderType}`)

            // Check if gender already exists
            const genderExists=await this.genderRepository.existsByGender(genderType)
            this.logger.log(`Gender exists check result: ${genderExists}`)

            if(genderExists) {
                throw new GenderAlreadyExistsException(genderType)
            }

            // Create gender entity
            const gender=Gender.create({
                gender: genderType
            })
            this.logger.log(`Created gender entity with id: ${gender.id}`)

            // Save to repository
            const savedGender=await this.genderRepository.save(gender)
            this.logger.log(`Saved gender to repository: ${savedGender.id}`)

            return {gender: savedGender}
        } catch(error) {
            this.logger.error(`Error in CreateGenderUseCase: ${error.message}`,error.stack)
            throw error
        }
    }

    private validateAndConvertGender(genderString: string): GenderType {
        this.logger.log(`Validating and converting gender string: ${genderString}`)

        // Try to find the gender in the enum
        const genderType=Object.values(GenderType).find(
            gt => gt.toLowerCase()===genderString.toLowerCase()
        )

        this.logger.log(`Found gender type: ${genderType}`)

        if(!genderType) {
            throw new InvalidGenderTypeException(genderString)
        }

        return genderType
    }
}
