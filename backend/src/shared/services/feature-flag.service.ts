import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'

@Injectable()
export class FeatureFlagService {
    constructor(private configService: ConfigService) {}

    isEnabled(feature: string): boolean {
        // Normaliza a chave da feature para o formato de variável de ambiente
        // Ex: 'heavy-reports' -> 'ENABLE_HEAVY_REPORTS'
        const envKey=`ENABLE_${feature.toUpperCase().replace(/-/g,'_')}`
        const value=this.configService.get<string>(envKey)

        // Retorna true se o valor for 'true' (case insensitive)
        return value?.toLowerCase()==='true'
    }
}
