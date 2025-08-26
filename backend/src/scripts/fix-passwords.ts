import { PrismaClient } from '@prisma/client'
import * as bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function fixPasswords() {
    try {
        console.log('🔧 Iniciando correção de senhas...')
        
        // Buscar todos os usuários
        const users = await prisma.user.findMany()
        console.log(`📊 Encontrados ${users.length} usuários`)
        
        for (const user of users) {
            console.log(`\n👤 Processando usuário: ${user.email}`)
            
            // Verificar se a senha já está hasheada
            const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$')
            
            if (isHashed) {
                console.log(`✅ Senha já está hasheada para ${user.email}`)
                continue
            }
            
            // Hash da senha
            const saltRounds = 12
            const hashedPassword = await bcryptjs.hash(user.password, saltRounds)
            
            // Atualizar usuário
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword }
            })
            
            console.log(`🔐 Senha hasheada para ${user.email}`)
        }
        
        console.log('\n🎉 Correção de senhas concluída!')
        
    } catch (error) {
        console.error('❌ Erro ao corrigir senhas:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Executar o script
fixPasswords()
