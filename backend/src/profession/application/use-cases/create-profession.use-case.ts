import {Inject,Injectable,Logger} from '@nestjs/common'
import {Profession,ProfessionType} from '../../domain/entities/profession'
import {InvalidProfessionTypeException,ProfessionAlreadyExistsException} from '../../domain/exceptions/profession-domain.exception'
import {ProfessionRepositoryPort} from '../../domain/ports/profession-repository.port'
import {PROFESSION_REPOSITORY} from '../../domain/tokens'

@Injectable()
export class CreateProfessionUseCase {
    private readonly logger=new Logger(CreateProfessionUseCase.name)

    constructor(
        @Inject(PROFESSION_REPOSITORY)
        private readonly professionRepository: ProfessionRepositoryPort
    ) {
        this.logger.log('CreateProfessionUseCase initialized')
    }

    async execute(professionInput: string): Promise<Profession> {
        try {
            this.logger.log(`Executing CreateProfessionUseCase with input: ${professionInput}`)

            // Validate and convert profession input
            const professionType=this.validateAndConvertProfession(professionInput)

            // Check if profession already exists
            const existingProfession=await this.professionRepository.existsByProfession(professionType)
            if(existingProfession) {
                throw new ProfessionAlreadyExistsException(professionType)
            }

            // Create new profession
            const profession=Profession.create(professionType)

            // Save to repository
            const savedProfession=await this.professionRepository.save(profession)

            this.logger.log(`Successfully created profession with id: ${savedProfession.id}`)
            return savedProfession
        } catch(error) {
            this.logger.error(`Error in CreateProfessionUseCase: ${error.message}`)
            throw error
        }
    }

    private validateAndConvertProfession(professionInput: string): ProfessionType {
        // Convert to uppercase and remove accents for comparison
        const normalizedInput=professionInput.toUpperCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g,'')

        // Map common variations to enum values
        const professionMap: Record<string,ProfessionType>={
            'ENGENHEIRO': ProfessionType.ENGINEER,
            'ENGINEER': ProfessionType.ENGINEER,
            'MEDICO': ProfessionType.DOCTOR,
            'DOCTOR': ProfessionType.DOCTOR,
            'PROFESSOR': ProfessionType.TEACHER,
            'TEACHER': ProfessionType.TEACHER,
            'ADVOGADO': ProfessionType.LAWYER,
            'LAWYER': ProfessionType.LAWYER,
            'CONTADOR': ProfessionType.ACCOUNTANT,
            'ACCOUNTANT': ProfessionType.ACCOUNTANT,
            'ENFERMEIRO': ProfessionType.NURSE,
            'NURSE': ProfessionType.NURSE,
            'ARQUITETO': ProfessionType.ARCHITECT,
            'ARCHITECT': ProfessionType.ARCHITECT,
            'DESIGNER': ProfessionType.DESIGNER,
            'DESENVOLVEDOR': ProfessionType.DEVELOPER,
            'DEVELOPER': ProfessionType.DEVELOPER,
            'GERENTE': ProfessionType.MANAGER,
            'MANAGER': ProfessionType.MANAGER,
            'VENDAS': ProfessionType.SALES,
            'SALES': ProfessionType.SALES,
            'MARKETING': ProfessionType.MARKETING,
            'FINANCAS': ProfessionType.FINANCE,
            'FINANCE': ProfessionType.FINANCE,
            'RECURSOS_HUMANOS': ProfessionType.HR,
            'HR': ProfessionType.HR,
            'OPERACOES': ProfessionType.OPERATIONS,
            'OPERATIONS': ProfessionType.OPERATIONS,
            'PESQUISA': ProfessionType.RESEARCH,
            'RESEARCH': ProfessionType.RESEARCH,
            'CONSULTOR': ProfessionType.CONSULTANT,
            'CONSULTANT': ProfessionType.CONSULTANT,
            'EMPREENDEDOR': ProfessionType.ENTREPRENEUR,
            'ENTREPRENEUR': ProfessionType.ENTREPRENEUR,
            'ESTUDANTE': ProfessionType.STUDENT,
            'STUDENT': ProfessionType.STUDENT,
            'OUTRO': ProfessionType.OTHER,
            'OTHER': ProfessionType.OTHER
        }

        const professionType=professionMap[normalizedInput]
        if(!professionType) {
            throw new InvalidProfessionTypeException(professionInput)
        }

        return professionType
    }
}
