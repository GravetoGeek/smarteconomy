import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'
import { TestDatabaseUtils } from '../../__tests__/utils/test-helpers'

describe('Auth E2E', () => {
    let app: INestApplication
    let prisma: PrismaService

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleFixture.createNestApplication()
        prisma = moduleFixture.get<PrismaService>(PrismaService)

        await app.init()
    })

    beforeEach(async () => {
        await TestDatabaseUtils.clearDatabase(prisma)
    })

    afterAll(async () => {
        await TestDatabaseUtils.clearDatabase(prisma)
        await app.close()
    })

    describe('Login', () => {
        it('should return error for invalid email format', async () => {
            // Arrange
            const loginMutation = `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            accessToken
          }
        }
      `

            // Act
            const response = await request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: loginMutation,
                    variables: {
                        input: {
                            email: 'invalid-email',
                            password: 'password123'
                        }
                    }
                })

            // Assert
            expect(response.status).toBe(200)
            expect(response.body.errors).toBeDefined()
            expect(response.body.errors[0].message).toContain('Invalid email format')
        })

        it('should validate password length', async () => {
            // Arrange
            const loginMutation = `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            accessToken
          }
        }
      `

            // Act
            const response = await request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: loginMutation,
                    variables: {
                        input: {
                            email: 'test@example.com',
                            password: '123'
                        }
                    }
                })

            // Assert
            expect(response.status).toBe(200)
            expect(response.body.errors).toBeDefined()
            expect(response.body.errors[0].message).toContain('Password must be at least 8 characters long')
        })
    })

    describe('Security Tests', () => {
        it('should prevent SQL injection in login', async () => {
            // Arrange
            const maliciousInput = {
                email: "admin'; DROP TABLE users; --",
                password: 'password'
            }

            const loginMutation = `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            accessToken
          }
        }
      `

            // Act
            const response = await request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: loginMutation,
                    variables: {
                        input: maliciousInput
                    }
                })

            // Assert
            expect(response.status).toBe(200)
            expect(response.body.errors).toBeDefined()
            expect(response.body.errors[0].message).toContain('Invalid email format')
        })

        it('should handle very long passwords', async () => {
            // Arrange
            const longPasswordInput = {
                email: 'test@example.com',
                password: 'a'.repeat(1000)
            }

            const loginMutation = `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            accessToken
          }
        }
      `

            // Act
            const response = await request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: loginMutation,
                    variables: {
                        input: longPasswordInput
                    }
                })

            // Assert
            expect(response.status).toBe(200)
            // Should either validate input or handle gracefully
            expect(response.body.errors || response.body.data).toBeDefined()
        })
    })
})
