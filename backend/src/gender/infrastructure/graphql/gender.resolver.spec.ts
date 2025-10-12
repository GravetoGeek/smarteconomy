import { Test, TestingModule } from '@nestjs/testing'
import { GenderResolver } from '../../interfaces/graphql/resolvers/gender.resolver'
import { GenderApplicationService } from '../../application/services/gender-application.service'

describe('GenderResolver', () => {
    let resolver: GenderResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GenderResolver,
                {
                    provide: GenderApplicationService,
                    useValue: {
                        getAllGenders: jest.fn().mockResolvedValue([]),
                        getGenderById: jest.fn().mockResolvedValue({ id: '1', gender: 'MALE', createdAt: new Date(), updatedAt: new Date() }),
                        createGender: jest.fn().mockResolvedValue({ id: '1', gender: 'MALE', createdAt: new Date(), updatedAt: new Date() })
                    }
                }
            ],
        }).compile()

        resolver = module.get<GenderResolver>(GenderResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined()
    })
});
