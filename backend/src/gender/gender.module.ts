import {Module} from '@nestjs/common';
import {GenderResolver} from './infrastructure/graphql/gender.resolver';

@Module({
    providers: [GenderResolver]
})
export class GenderModule {}
