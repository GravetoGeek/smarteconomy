import {PrismaService} from '@/database/prisma/prisma.service'
import {Injectable,Logger} from '@nestjs/common'
import {Profession} from '../../domain/entities/profession'
import {ProfessionRepositoryPort} from '../../domain/ports/profession-repository.port'

@Injectable()
export class ProfessionPrismaRepository implements ProfessionRepositoryPort {
    private readonly logger=new Logger(ProfessionPrismaRepository.name)

    constructor(private readonly prisma: PrismaService) {
        this.logger.log('ProfessionPrismaRepository initialized')
    }

    async save(profession: Profession): Promise<Profession> {
        try {
            this.logger.log(`Saving profession with id: ${profession.id}`)

            const professionData={
                id: profession.id,
                profession: profession.profession,
                createdAt: profession.createdAt,
                updatedAt: profession.updatedAt
            }

            const savedProfession=await this.prisma.profession.upsert({
                where: {id: profession.id},
                update: professionData,
                create: professionData
            })

            return Profession.reconstitute(
                savedProfession.id,
                savedProfession.profession,
                savedProfession.createdAt,
                savedProfession.updatedAt
            )
        } catch(error) {
            this.logger.error(`Error saving profession: ${error.message}`)
            throw error
        }
    }

    async findById(id: string): Promise<Profession|null> {
        try {
            this.logger.log(`Finding profession by id: ${id}`)
            const profession=await this.prisma.profession.findUnique({
                where: {id}
            })

            if(!profession) {
                return null
            }

            return Profession.reconstitute(
                profession.id,
                profession.profession,
                profession.createdAt,
                profession.updatedAt
            )
        } catch(error) {
            this.logger.error(`Error finding profession by id: ${error.message}`)
            throw error
        }
    }

    async findByProfession(profession: string): Promise<Profession|null> {
        try {
            this.logger.log(`Finding profession by profession: ${profession}`)
            const foundProfession=await this.prisma.profession.findUnique({
                where: {profession}
            })

            if(!foundProfession) {
                return null
            }

            return Profession.reconstitute(
                foundProfession.id,
                foundProfession.profession,
                foundProfession.createdAt,
                foundProfession.updatedAt
            )
        } catch(error) {
            this.logger.error(`Error finding profession by profession: ${error.message}`)
            throw error
        }
    }

    async findAll(): Promise<Profession[]> {
        try {
            this.logger.log('Finding all professions')
            const professions=await this.prisma.profession.findMany({
                orderBy: {profession: 'asc'}
            })

            return professions.map(profession =>
                Profession.reconstitute(
                    profession.id,
                    profession.profession,
                    profession.createdAt,
                    profession.updatedAt
                )
            )
        } catch(error) {
            this.logger.error(`Error finding all professions: ${error.message}`)
            throw error
        }
    }

    async delete(id: string): Promise<void> {
        try {
            this.logger.log(`Deleting profession with id: ${id}`)
            await this.prisma.profession.delete({
                where: {id}
            })
        } catch(error) {
            this.logger.error(`Error deleting profession: ${error.message}`)
            throw error
        }
    }

    async existsById(id: string): Promise<boolean> {
        try {
            this.logger.log(`Checking if profession exists by id: ${id}`)
            const count=await this.prisma.profession.count({
                where: {id}
            })
            return count>0
        } catch(error) {
            this.logger.error(`Error checking if profession exists by id: ${error.message}`)
            throw error
        }
    }

    async existsByProfession(profession: string): Promise<boolean> {
        try {
            this.logger.log(`Checking if profession exists by profession: ${profession}`)
            const count=await this.prisma.profession.count({
                where: {profession}
            })
            return count>0
        } catch(error) {
            this.logger.error(`Error checking if profession exists by profession: ${error.message}`)
            throw error
        }
    }
}
