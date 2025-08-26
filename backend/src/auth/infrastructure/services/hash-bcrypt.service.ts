import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { HashServicePort } from '../../domain/ports/hash-service.port'

@Injectable()
export class HashBcryptService implements HashServicePort {
    async hash(password: string): Promise<string> {
        const saltRounds = 12
        return bcrypt.hash(password, saltRounds)
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }
}
