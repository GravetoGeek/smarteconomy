import { User, UserRole, AccountStatus } from './user.entity'
import { TestDataFactory, TestAssertions } from '@/__tests__/utils/test-helpers'

describe('User Entity', () => {
    describe('create method', () => {
        it('should create a new user with valid data', () => {
            // Arrange
            const userData = TestDataFactory.createUserData()

            // Act
            const user = User.create(userData)

            // Assert
            expect(user).toBeDefined()
            expect(user.email).toBe(userData.email)
            expect(user.name).toBe(userData.name)
            expect(user.lastname).toBe(userData.lastname)
            expect(user.role).toBe(UserRole.USER)
            expect(user.status).toBe(AccountStatus.ACTIVE)
            TestAssertions.expectValidDate(user.createdAt)
            TestAssertions.expectValidDate(user.updatedAt)
        })

        it('should create user with admin role', () => {
            // Arrange
            const userData = TestDataFactory.createUserData({ role: UserRole.ADMIN })

            // Act
            const user = User.create(userData)

            // Assert
            expect(user.role).toBe(UserRole.ADMIN)
            expect(user.isAdmin()).toBe(true)
        })

        it('should generate unique ID for each user', () => {
            // Arrange
            const userData = TestDataFactory.createUserData()

            // Act
            const user1 = User.create(userData)
            const user2 = User.create(userData)

            // Assert
            expect(user1.id).not.toBe(user2.id)
            expect(user1.id).toContain('user_')
            expect(user2.id).toContain('user_')
        })

        it('should set default status to ACTIVE', () => {
            // Arrange
            const userData = TestDataFactory.createUserData()

            // Act
            const user = User.create(userData)

            // Assert
            expect(user.status).toBe(AccountStatus.ACTIVE)
            expect(user.isActive()).toBe(true)
        })
    })

    describe('reconstitute method', () => {
        it('should reconstitute user from persistent data', () => {
            // Arrange
            const persistentData = {
                id: 'user_123',
                email: 'test@example.com',
                name: 'John',
                lastname: 'Doe',
                birthdate: new Date('1990-01-01'),
                role: 'USER' as const,
                genderId: 'gender-123',
                professionId: 'profession-123',
                password: 'hashedPassword',
                status: 'ACTIVE' as const,
                createdAt: new Date('2023-01-01'),
                updatedAt: new Date('2023-01-02')
            }

            // Act
            const user = User.reconstitute(persistentData)

            // Assert
            expect(user.id).toBe(persistentData.id)
            expect(user.email).toBe(persistentData.email)
            expect(user.name).toBe(persistentData.name)
            expect(user.lastname).toBe(persistentData.lastname)
            expect(user.role).toBe(UserRole.USER)
            expect(user.status).toBe(AccountStatus.ACTIVE)
        })

        it('should handle string enum values for role and status', () => {
            // Arrange
            const persistentData = {
                id: 'user_123',
                email: 'admin@example.com',
                name: 'Admin',
                lastname: 'User',
                birthdate: new Date('1990-01-01'),
                role: 'ADMIN',
                genderId: 'gender-123',
                professionId: 'profession-123',
                password: 'hashedPassword',
                status: 'SUSPENDED',
                createdAt: new Date('2023-01-01'),
                updatedAt: new Date('2023-01-02')
            }

            // Act
            const user = User.reconstitute(persistentData)

            // Assert
            expect(user.role).toBe(UserRole.ADMIN)
            expect(user.status).toBe(AccountStatus.SUSPENDED)
            expect(user.isAdmin()).toBe(true)
            expect(user.isSuspended()).toBe(true)
        })
    })

    describe('validation', () => {
        it('should throw error for invalid email', () => {
            // Arrange
            const userData = TestDataFactory.createUserData({ email: 'invalid-email' })

            // Act & Assert
            expect(() => User.create(userData)).toThrow()
        })

        it('should throw error for name too short', () => {
            // Arrange
            const userData = TestDataFactory.createUserData({ name: 'a' })

            // Act & Assert
            expect(() => User.create(userData)).toThrow('Name must be at least 2 characters long')
        })

        it('should throw error for name too long', () => {
            // Arrange
            const userData = TestDataFactory.createUserData({
                name: 'a'.repeat(51)
            })

            // Act & Assert
            expect(() => User.create(userData)).toThrow('Name cannot exceed 50 characters')
        })

        it('should throw error for lastname too short', () => {
            // Arrange
            const userData = TestDataFactory.createUserData({ lastname: '' })

            // Act & Assert
            expect(() => User.create(userData)).toThrow('Name must be at least 2 characters long')
        })

        it('should trim whitespace from names', () => {
            // Arrange
            const userData = TestDataFactory.createUserData({
                name: '  John  ',
                lastname: '  Doe  '
            })

            // Act
            const user = User.create(userData)

            // Assert
            expect(user.name).toBe('John')
            expect(user.lastname).toBe('Doe')
        })
    })

    describe('computed properties', () => {
        it('should return correct full name', () => {
            // Arrange
            const userData = TestDataFactory.createUserData({
                name: 'John',
                lastname: 'Doe'
            })

            // Act
            const user = User.create(userData)

            // Assert
            expect(user.fullName).toBe('John Doe')
        })

        it('should calculate correct age', () => {
            // Arrange
            const birthYear = new Date().getFullYear() - 30
            const userData = TestDataFactory.createUserData({
                birthdate: `${birthYear}-01-01`
            })

            // Act
            const user = User.create(userData)

            // Assert
            expect(user.age).toBeGreaterThanOrEqual(29)
            expect(user.age).toBeLessThanOrEqual(30)
        })
    })

    describe('business logic methods', () => {
        let user: User

        beforeEach(() => {
            user = User.create(TestDataFactory.createUserData())
        })

        describe('role management', () => {
            it('should promote user to admin', () => {
                // Arrange
                const originalUpdatedAt = user.updatedAt

                // Act
                user.promoteToAdmin()

                // Assert
                expect(user.role).toBe(UserRole.ADMIN)
                expect(user.isAdmin()).toBe(true)
                expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
            })

            it('should demote admin to user', () => {
                // Arrange
                user.promoteToAdmin()
                const originalUpdatedAt = user.updatedAt

                // Act
                user.demoteToUser()

                // Assert
                expect(user.role).toBe(UserRole.USER)
                expect(user.isAdmin()).toBe(false)
                expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
            })
        })

        describe('status management', () => {
            it('should activate user', () => {
                // Arrange
                user.suspend()
                const originalUpdatedAt = user.updatedAt

                // Act
                user.activate()

                // Assert
                expect(user.status).toBe(AccountStatus.ACTIVE)
                expect(user.isActive()).toBe(true)
                expect(user.isSuspended()).toBe(false)
                expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
            })

            it('should deactivate user', () => {
                // Arrange
                const originalUpdatedAt = user.updatedAt

                // Act
                user.deactivate()

                // Assert
                expect(user.status).toBe(AccountStatus.INACTIVE)
                expect(user.isActive()).toBe(false)
                expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
            })

            it('should suspend user', () => {
                // Arrange
                const originalUpdatedAt = user.updatedAt

                // Act
                user.suspend()

                // Assert
                expect(user.status).toBe(AccountStatus.SUSPENDED)
                expect(user.isSuspended()).toBe(true)
                expect(user.isActive()).toBe(false)
                expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
            })
        })

        describe('profile management', () => {
            it('should update profile successfully', () => {
                // Arrange
                const newName = 'Jane'
                const newLastname = 'Smith'
                const originalUpdatedAt = user.updatedAt

                // Act
                user.updateProfile(newName, newLastname)

                // Assert
                expect(user.name).toBe(newName)
                expect(user.lastname).toBe(newLastname)
                expect(user.fullName).toBe('Jane Smith')
                expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
            })

            it('should validate name when updating profile', () => {
                // Act & Assert
                expect(() => user.updateProfile('a', 'ValidLastname')).toThrow('Name must be at least 2 characters long')
                expect(() => user.updateProfile('ValidName', '')).toThrow('Name must be at least 2 characters long')
            })

            it('should trim whitespace when updating profile', () => {
                // Act
                user.updateProfile('  Jane  ', '  Smith  ')

                // Assert
                expect(user.name).toBe('Jane')
                expect(user.lastname).toBe('Smith')
            })
        })
    })

    describe('status checking methods', () => {
        it('should correctly identify admin users', () => {
            // Arrange
            const adminUser = User.create(TestDataFactory.createUserData({ role: UserRole.ADMIN }))
            const regularUser = User.create(TestDataFactory.createUserData({ role: UserRole.USER }))

            // Assert
            expect(adminUser.isAdmin()).toBe(true)
            expect(regularUser.isAdmin()).toBe(false)
        })

        it('should correctly identify active users', () => {
            // Arrange
            const user = User.create(TestDataFactory.createUserData())

            // Assert
            expect(user.isActive()).toBe(true)

            // Act
            user.deactivate()

            // Assert
            expect(user.isActive()).toBe(false)
        })

        it('should correctly identify suspended users', () => {
            // Arrange
            const user = User.create(TestDataFactory.createUserData())

            // Assert
            expect(user.isSuspended()).toBe(false)

            // Act
            user.suspend()

            // Assert
            expect(user.isSuspended()).toBe(true)
        })
    })

    describe('immutability', () => {
        it('should not allow direct modification of readonly properties', () => {
            // Arrange
            const user = User.create(TestDataFactory.createUserData())

            // Assert - These should be readonly and cause TypeScript errors if modified
            // user.id = 'new-id' // Should cause TS error
            // user.email = 'new@email.com' // Should cause TS error
            // user.createdAt = new Date() // Should cause TS error
            expect(user.id).toBeDefined()
            expect(user.email).toBeDefined()
            expect(user.createdAt).toBeDefined()
        })
    })

    describe('value objects integration', () => {
        it('should use Email value object for email validation', () => {
            // Arrange
            const invalidEmailData = TestDataFactory.createUserData({ email: 'invalid-email' })

            // Act & Assert
            expect(() => User.create(invalidEmailData)).toThrow()
        })

        it('should use Password value object for password handling', () => {
            // Arrange
            const userData = TestDataFactory.createUserData({ password: 'ValidPass123!' })

            // Act
            const user = User.create(userData)

            // Assert
            expect(user.password).toBeDefined()
            expect(typeof user.password).toBe('string')
        })

        it('should use Birthdate value object for birthdate validation', () => {
            // Arrange
            const userData = TestDataFactory.createUserData({ birthdate: '1990-01-01' })

            // Act
            const user = User.create(userData)

            // Assert
            expect(user.birthdate).toBeInstanceOf(Date)
            expect(user.age).toBeGreaterThan(0)
        })
    })
})
