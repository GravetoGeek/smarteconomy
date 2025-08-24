import {PrismaService} from '@/database/prisma/prisma.service'
import {Injectable,Logger} from '@nestjs/common'
import {Gender,GenderType} from '../../domain/entities/gender'
import {GenderRepositoryPort} from '../../domain/ports/gender-repository.port'

@Injectable()
export class GenderPrismaRepository implements GenderRepositoryPort {
    private readonly logger=new Logger(GenderPrismaRepository.name)

    constructor(private readonly prisma: PrismaService) {}

    async save(gender: Gender): Promise<Gender> {
        try {
            this.logger.log(`Saving gender: ${gender.id}`)

            const savedGender=await this.prisma.gender.upsert({
                where: {id: gender.id},
                update: {
                    gender: gender.gender,
                    updatedAt: gender.updatedAt
                },
                create: {
                    id: gender.id,
                    gender: gender.gender,
                    createdAt: gender.createdAt,
                    updatedAt: gender.updatedAt
                }
            })

            return Gender.reconstitute(savedGender)
        } catch(error) {
            this.logger.error(`Error saving gender: ${error.message}`)
            throw error
        }
    }

    async findById(id: string): Promise<Gender|null> {
        try {
            this.logger.log(`Finding gender by id: ${id}`)

            const gender=await this.prisma.gender.findUnique({
                where: {id}
            })

            return gender? Gender.reconstitute(gender):null
        } catch(error) {
            this.logger.error(`Error finding gender by id: ${error.message}`)
            throw error
        }
    }

    async findByGender(gender: string): Promise<Gender|null> {
        try {
            this.logger.log(`Finding gender by gender: ${gender}`)

            const foundGender=await this.prisma.gender.findFirst({
                where: {gender}
            })

            return foundGender? Gender.reconstitute(foundGender):null
        } catch(error) {
            this.logger.error(`Error finding gender by gender: ${error.message}`)
            throw error
        }
    }

    async findAll(): Promise<Gender[]> {
        try {
            this.logger.log('Finding all genders')

            const genders=await this.prisma.gender.findMany({
                orderBy: {createdAt: 'asc'}
            })

            return genders.map(gender => Gender.reconstitute(gender))
        } catch(error) {
            this.logger.error(`Error finding all genders: ${error.message}`)
            throw error
        }
    }

    async delete(id: string): Promise<void> {
        try {
            this.logger.log(`Deleting gender: ${id}`)

            await this.prisma.gender.delete({
                where: {id}
            })
        } catch(error) {
            this.logger.error(`Error deleting gender: ${error.message}`)
            throw error
        }
    }

    async existsById(id: string): Promise<boolean> {
        try {
            this.logger.log(`Checking if gender exists by id: ${id}`)

            const count=await this.prisma.gender.count({
                where: {id}
            })

            return count>0
        } catch(error) {
            this.logger.error(`Error checking if gender exists by id: ${error.message}`)
            throw error
        }
    }

    async existsByGender(gender: string): Promise<boolean> {
        try {
            this.logger.log(`Checking if gender exists by gender: ${gender}`)

            const count=await this.prisma.gender.count({
                where: {gender}
            })

            return count>0
        } catch(error) {
            this.logger.error(`Error checking if gender exists by gender: ${error.message}`)
            throw error
        }
    }
}
