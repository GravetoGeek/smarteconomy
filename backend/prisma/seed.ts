import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Inserir dados de gênero
  const genders = await Promise.all([
    prisma.gender.upsert({
      where: { id: '550e8400-e29b-41d4-a716-446655440001' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        gender: 'Masculino',
      },
    }),
    prisma.gender.upsert({
      where: { id: '550e8400-e29b-41d4-a716-446655440002' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440002',
        gender: 'Feminino',
      },
    }),
    prisma.gender.upsert({
      where: { id: '550e8400-e29b-41d4-a716-446655440003' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440003',
        gender: 'Não Binário',
      },
    }),
    prisma.gender.upsert({
      where: { id: '550e8400-e29b-41d4-a716-446655440004' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440004',
        gender: 'Prefere não informar',
      },
    }),
  ])

  // Inserir dados de profissão
  const professions = await Promise.all([
    prisma.profession.upsert({
      where: { id: '660e8400-e29b-41d4-a716-446655440001' },
      update: {},
      create: {
        id: '660e8400-e29b-41d4-a716-446655440001',
        profession: 'Desenvolvedor de Software',
      },
    }),
    prisma.profession.upsert({
      where: { id: '660e8400-e29b-41d4-a716-446655440002' },
      update: {},
      create: {
        id: '660e8400-e29b-41d4-a716-446655440002',
        profession: 'Analista de Sistemas',
      },
    }),
    prisma.profession.upsert({
      where: { id: '660e8400-e29b-41d4-a716-446655440003' },
      update: {},
      create: {
        id: '660e8400-e29b-41d4-a716-446655440003',
        profession: 'Gerente de Projetos',
      },
    }),
    prisma.profession.upsert({
      where: { id: '660e8400-e29b-41d4-a716-446655440004' },
      update: {},
      create: {
        id: '660e8400-e29b-41d4-a716-446655440004',
        profession: 'Designer UX/UI',
      },
    }),
    prisma.profession.upsert({
      where: { id: '660e8400-e29b-41d4-a716-446655440005' },
      update: {},
      create: {
        id: '660e8400-e29b-41d4-a716-446655440005',
        profession: 'Analista de Dados',
      },
    }),
  ])

  console.log('Seed executado com sucesso!')
  console.log('Gêneros criados:', genders.length)
  console.log('Profissões criadas:', professions.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
