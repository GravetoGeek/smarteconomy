import {Injectable} from '@nestjs/common'
import * as bcryptjs from 'bcryptjs'
import {HashServicePort} from '../../domain/ports/hash-service.port'

@Injectable()
export class HashBcryptService implements HashServicePort {
    async hash(password: string): Promise<string> {
        const saltRounds=12
        return bcryptjs.hash(password,saltRounds)
    }

    async compare(password: string,hash: string): Promise<boolean> {
        return bcryptjs.compare(password,hash)
    }
}
