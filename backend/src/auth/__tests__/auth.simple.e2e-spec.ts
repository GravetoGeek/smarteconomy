import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../../app.module'

describe('Authentication E2E (Simple)', () => {
    let app: INestApplication

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })

    afterAll(async () => {
        await app.close()
    })

    describe('GraphQL Endpoint', () => {
        it('should be accessible', async () => {
            const response = await request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: '{ __schema { types { name } } }'
                })
                .expect(200)

            expect(response.body.data).toBeDefined()
            expect(response.body.data.__schema).toBeDefined()
        })

        it('should handle invalid GraphQL syntax', async () => {
            const response = await request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: 'invalid GraphQL syntax {'
                })

            expect(response.status).toBeGreaterThanOrEqual(400)
            expect(response.body.errors).toBeDefined()
        })
    })
})
