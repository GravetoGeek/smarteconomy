import {Test,TestingModule} from '@nestjs/testing'
import {ProfessionApplicationService} from '../../../application/services/profession-application.service'
import {Profession,ProfessionType} from '../../../domain/entities/profession'
import {CreateProfessionInput} from '../../dtos/inputs/create-profession.input'
import {ProfessionGraphQLMapper} from '../mappers/profession-graphql.mapper'
import {ProfessionResolver} from './profession.resolver'

describe('ProfessionResolver',() => {
    let resolver: ProfessionResolver
    let professionApplicationService: jest.Mocked<ProfessionApplicationService>

    const createProfession=(overrides: Partial<{
        id: string
        profession: ProfessionType
        createdAt: Date
        updatedAt: Date
    }>={}): Profession => {
        const professionValue=overrides.profession??ProfessionType.ENGINEER

        return Profession.reconstitute(
            overrides.id??'profession-1',
            professionValue,
            overrides.createdAt??new Date('2023-01-01T00:00:00.000Z'),
            overrides.updatedAt??new Date('2023-01-02T00:00:00.000Z')
        )
    }

    beforeEach(async () => {
        const module: TestingModule=await Test.createTestingModule({
            providers: [
                ProfessionResolver,
                {
                    provide: ProfessionApplicationService,
                    useValue: {
                        getAllProfessions: jest.fn(),
                        getProfessionById: jest.fn(),
                        createProfession: jest.fn()
                    }
                }
            ]
        }).compile()

        resolver=module.get<ProfessionResolver>(ProfessionResolver)
        professionApplicationService=module.get(ProfessionApplicationService)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should be defined',() => {
        expect(resolver).toBeDefined()
    })

    describe('professions',() => {
        it('should map professions to DTOs',async () => {
            const mockProfessions=[
                createProfession(),
                createProfession({id: 'profession-2',profession: ProfessionType.DEVELOPER})
            ]
            professionApplicationService.getAllProfessions.mockResolvedValue(mockProfessions)

            const result=await resolver.professions()

            expect(result).toEqual(ProfessionGraphQLMapper.toModelList(mockProfessions))
            expect(professionApplicationService.getAllProfessions).toHaveBeenCalledTimes(1)
        })
    })

    describe('profession',() => {
        it('should map single profession to DTO',async () => {
            const mockProfession=createProfession({id: 'profession-3'})
            professionApplicationService.getProfessionById.mockResolvedValue(mockProfession)

            const result=await resolver.profession('profession-3')

            expect(result).toEqual(ProfessionGraphQLMapper.toModel(mockProfession))
            expect(professionApplicationService.getProfessionById).toHaveBeenCalledWith('profession-3')
        })
    })

    describe('createProfession',() => {
        it('should map created profession to DTO',async () => {
            const input: CreateProfessionInput={profession: ProfessionType.CONSULTANT}
            const createdProfession=createProfession({id: 'profession-4',profession: ProfessionType.CONSULTANT})
            professionApplicationService.createProfession.mockResolvedValue(createdProfession)

            const result=await resolver.createProfession(input)

            expect(result).toEqual(ProfessionGraphQLMapper.toModel(createdProfession))
            expect(professionApplicationService.createProfession).toHaveBeenCalledWith(input.profession)
        })
    })
})
