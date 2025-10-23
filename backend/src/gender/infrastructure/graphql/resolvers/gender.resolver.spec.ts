import {Test,TestingModule} from '@nestjs/testing'
import {GenderApplicationService} from '../../../application/services/gender-application.service'
import {Gender,GenderType} from '../../../domain/entities/gender'
import {CreateGenderInput} from '../../dtos/inputs/create-gender.input'
import {GenderGraphQLMapper} from '../mappers/gender-graphql.mapper'
import {GenderResolver} from './gender.resolver'

describe('GenderResolver',() => {
    let resolver: GenderResolver
    let genderApplicationService: jest.Mocked<GenderApplicationService>

    const createGender=(overrides: Partial<{
        id: string
        gender: GenderType
        createdAt: Date
        updatedAt: Date
    }>={}): Gender => {
        const genderValue=overrides.gender??GenderType.MALE

        return Gender.reconstitute({
            id: overrides.id??'gender-1',
            gender: genderValue as unknown as string,
            createdAt: overrides.createdAt??new Date('2023-01-01T00:00:00.000Z'),
            updatedAt: overrides.updatedAt??new Date('2023-01-02T00:00:00.000Z')
        })
    }

    beforeEach(async () => {
        const module: TestingModule=await Test.createTestingModule({
            providers: [
                GenderResolver,
                {
                    provide: GenderApplicationService,
                    useValue: {
                        getAllGenders: jest.fn(),
                        getGenderById: jest.fn(),
                        createGender: jest.fn()
                    }
                }
            ]
        }).compile()

        resolver=module.get<GenderResolver>(GenderResolver)
        genderApplicationService=module.get(GenderApplicationService)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should be defined',() => {
        expect(resolver).toBeDefined()
    })

    describe('genders',() => {
        it('should map all genders to DTOs',async () => {
            const mockGenders=[
                createGender(),
                createGender({id: 'gender-2',gender: GenderType.FEMALE})
            ]
            genderApplicationService.getAllGenders.mockResolvedValue(mockGenders)

            const result=await resolver.genders()

            expect(result).toEqual(GenderGraphQLMapper.toModelList(mockGenders))
            expect(genderApplicationService.getAllGenders).toHaveBeenCalledTimes(1)
        })
    })

    describe('gender',() => {
        it('should map single gender to DTO',async () => {
            const mockGender=createGender({id: 'gender-3'})
            genderApplicationService.getGenderById.mockResolvedValue(mockGender)

            const result=await resolver.gender('gender-3')

            expect(result).toEqual(GenderGraphQLMapper.toModel(mockGender))
            expect(genderApplicationService.getGenderById).toHaveBeenCalledWith('gender-3')
        })
    })

    describe('createGender',() => {
        it('should map created gender to DTO',async () => {
            const input: CreateGenderInput={gender: GenderType.OTHER}
            const createdGender=createGender({id: 'gender-4',gender: GenderType.OTHER})
            genderApplicationService.createGender.mockResolvedValue(createdGender)

            const result=await resolver.createGender(input)

            expect(result).toEqual(GenderGraphQLMapper.toModel(createdGender))
            expect(genderApplicationService.createGender).toHaveBeenCalledWith(input.gender)
        })
    })
})
