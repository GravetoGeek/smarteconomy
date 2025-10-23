import { registerEnumType } from '@nestjs/graphql'

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED'
}

// Registrar enums para GraphQL
registerEnumType(UserRole, {
    name: 'UserRole',
    description: 'User role enum'
})

registerEnumType(AccountStatus, {
    name: 'AccountStatus',
    description: 'Account status enum'
})
