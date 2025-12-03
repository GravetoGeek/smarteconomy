import {ConfigService} from '@nestjs/config'
import {Test,TestingModule} from '@nestjs/testing'
import {FeatureFlagService} from './feature-flag.service'

describe('FeatureFlagService',() => {
    let service: FeatureFlagService
    let configService: ConfigService

    beforeEach(async () => {
        const module: TestingModule=await Test.createTestingModule({
            providers: [
                FeatureFlagService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile()

        service=module.get<FeatureFlagService>(FeatureFlagService)
        configService=module.get<ConfigService>(ConfigService)
    })

    it('should be defined',() => {
        expect(service).toBeDefined()
    })

    it('should return true when feature flag is enabled (true)',() => {
        jest.spyOn(configService,'get').mockReturnValue('true')
        expect(service.isEnabled('heavy-reports')).toBe(true)
        expect(configService.get).toHaveBeenCalledWith('ENABLE_HEAVY_REPORTS')
    })

    it('should return true when feature flag is enabled (TRUE)',() => {
        jest.spyOn(configService,'get').mockReturnValue('TRUE')
        expect(service.isEnabled('heavy-reports')).toBe(true)
    })

    it('should return false when feature flag is disabled (false)',() => {
        jest.spyOn(configService,'get').mockReturnValue('false')
        expect(service.isEnabled('heavy-reports')).toBe(false)
    })

    it('should return false when feature flag is missing',() => {
        jest.spyOn(configService,'get').mockReturnValue(undefined)
        expect(service.isEnabled('heavy-reports')).toBe(false)
    })

    it('should normalize feature name correctly',() => {
        jest.spyOn(configService,'get').mockReturnValue('true')
        service.isEnabled('new-awesome-feature')
        expect(configService.get).toHaveBeenCalledWith('ENABLE_NEW_AWESOME_FEATURE')
    })
})
