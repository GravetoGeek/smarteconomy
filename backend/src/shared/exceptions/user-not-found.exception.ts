import {NotFoundException} from '@nestjs/common'

export class UserNotFoundException extends NotFoundException {
    constructor(email?: string) {
        const message=email
            ? `User with email ${email} not found`
            :'User not found'

        super(message)
    }
}
