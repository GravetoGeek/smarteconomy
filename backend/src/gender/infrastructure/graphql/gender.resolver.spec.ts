import {Test,TestingModule} from '@nestjs/testing';
import {GenderResolver} from './gender.resolver';

describe('GenderResolver',() => {
    let resolver: GenderResolver;

    beforeEach(async () => {
        const module: TestingModule=await Test.createTestingModule({
            providers: [GenderResolver],
        }).compile();

        resolver=module.get<GenderResolver>(GenderResolver);
    });

    it('should be defined',() => {
        expect(resolver).toBeDefined();
    });
});
