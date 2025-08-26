-- Script para popular o banco de dados SmartEconomy
-- Ordem de prioridade baseada nas relações/dependências

-- 1. Genders (sem dependências)
INSERT INTO "Gender" (id, gender, "createdAt", "updatedAt") VALUES
  ('gender-01', 'Masculino', NOW(), NOW()),
  ('gender-02', 'Feminino', NOW(), NOW()),
  ('gender-03', 'Não-binário', NOW(), NOW()),
  ('gender-04', 'Prefiro não informar', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Professions (sem dependências)
INSERT INTO "Profession" (id, profession, "createdAt", "updatedAt") VALUES
  ('prof-01', 'Desenvolvedor de Software', NOW(), NOW()),
  ('prof-02', 'Analista de Sistemas', NOW(), NOW()),
  ('prof-03', 'Gerente de Projetos', NOW(), NOW()),
  ('prof-04', 'Designer UX/UI', NOW(), NOW()),
  ('prof-05', 'Engenheiro', NOW(), NOW()),
  ('prof-06', 'Advogado', NOW(), NOW()),
  ('prof-07', 'Médico', NOW(), NOW()),
  ('prof-08', 'Professor', NOW(), NOW()),
  ('prof-09', 'Contador', NOW(), NOW()),
  ('prof-10', 'Empresário', NOW(), NOW()),
  ('prof-11', 'Estudante', NOW(), NOW()),
  ('prof-12', 'Outros', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. PostCategories (sem dependências)
INSERT INTO "PostCategory" (id, category, "createdAt", "updatedAt") VALUES
  ('cat-01', 'Alimentação', NOW(), NOW()),
  ('cat-02', 'Transporte', NOW(), NOW()),
  ('cat-03', 'Moradia', NOW(), NOW()),
  ('cat-04', 'Saúde', NOW(), NOW()),
  ('cat-05', 'Educação', NOW(), NOW()),
  ('cat-06', 'Lazer', NOW(), NOW()),
  ('cat-07', 'Vestuário', NOW(), NOW()),
  ('cat-08', 'Tecnologia', NOW(), NOW()),
  ('cat-09', 'Investimentos', NOW(), NOW()),
  ('cat-10', 'Impostos', NOW(), NOW()),
  ('cat-11', 'Seguros', NOW(), NOW()),
  ('cat-12', 'Outros', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Users (depende de Gender, Profession) - Profiles serão criados depois
INSERT INTO "User" (id, email, name, lastname, birthdate, role, "genderId", "professionId", password, status, "createdAt", "updatedAt") VALUES
  ('user-admin', 'admin@smarteconomy.com', 'Administrador', 'Sistema', '1990-01-01', 'ADMIN', 'gender-01', 'prof-01', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNV2vg4hFCOQ2', 'ACTIVE', NOW(), NOW()),
  ('user-01', 'joao.silva@example.com', 'João', 'Silva', '1985-03-15', 'USER', 'gender-01', 'prof-01', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNV2vg4hFCOQ2', 'ACTIVE', NOW(), NOW()),
  ('user-02', 'maria.santos@example.com', 'Maria', 'Santos', '1992-07-22', 'USER', 'gender-02', 'prof-04', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNV2vg4hFCOQ2', 'ACTIVE', NOW(), NOW()),
  ('user-03', 'pedro.costa@example.com', 'Pedro', 'Costa', '1988-11-10', 'USER', 'gender-01', 'prof-03', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNV2vg4hFCOQ2', 'ACTIVE', NOW(), NOW()),
  ('user-04', 'ana.oliveira@example.com', 'Ana', 'Oliveira', '1995-05-18', 'USER', 'gender-02', 'prof-07', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNV2vg4hFCOQ2', 'ACTIVE', NOW(), NOW()),
  ('user-05', 'carlos.fernandes@example.com', 'Carlos', 'Fernandes', '1980-12-03', 'USER', 'gender-01', 'prof-10', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNV2vg4hFCOQ2', 'ACTIVE', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. Profiles (depende de User - relação 1:1)
INSERT INTO "Profile" (id, bio, "userId", "createdAt", "updatedAt") VALUES
  ('profile-01', 'Perfil conservador focado em preservação de capital e baixo risco', 'user-01', NOW(), NOW()),
  ('profile-02', 'Perfil moderado equilibrado entre risco e retorno', 'user-02', NOW(), NOW()),
  ('profile-03', 'Perfil arrojado disposto a assumir maiores riscos por maiores retornos', 'user-03', NOW(), NOW()),
  ('profile-04', 'Perfil iniciante para usuários que estão começando na vida financeira', 'user-04', NOW(), NOW()),
  ('profile-05', 'Perfil empresarial com foco em diversificação e crescimento', 'user-05', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 6. Accounts (depende de User)
INSERT INTO "Account" (id, name, type, balance, "userId", status, "createdAt", "updatedAt") VALUES
  -- Contas do João Silva
  ('acc-01', 'Conta Corrente Principal', 'CHECKING', 2500.75, 'user-01', 'ACTIVE', NOW(), NOW()),
  ('acc-02', 'Conta Poupança', 'SAVINGS', 15000.00, 'user-01', 'ACTIVE', NOW(), NOW()),
  ('acc-03', 'Cartão Visa Gold', 'CREDIT_CARD', -850.30, 'user-01', 'ACTIVE', NOW(), NOW()),
  ('acc-04', 'Carteira Digital', 'WALLET', 300.50, 'user-01', 'ACTIVE', NOW(), NOW()),

  -- Contas da Maria Santos
  ('acc-05', 'Conta Corrente', 'CHECKING', 1800.40, 'user-02', 'ACTIVE', NOW(), NOW()),
  ('acc-06', 'Conta Poupança Planejada', 'SAVINGS', 8500.00, 'user-02', 'ACTIVE', NOW(), NOW()),
  ('acc-07', 'Cartão Mastercard', 'CREDIT_CARD', -1200.00, 'user-02', 'ACTIVE', NOW(), NOW()),

  -- Contas do Pedro Costa
  ('acc-08', 'Conta Empresarial', 'CHECKING', 45000.00, 'user-03', 'ACTIVE', NOW(), NOW()),
  ('acc-09', 'Investimentos Renda Fixa', 'INVESTMENT', 75000.00, 'user-03', 'ACTIVE', NOW(), NOW()),
  ('acc-10', 'Investimentos Renda Variável', 'INVESTMENT', 125000.00, 'user-03', 'ACTIVE', NOW(), NOW()),

  -- Contas da Ana Oliveira
  ('acc-11', 'Conta Corrente Médica', 'CHECKING', 6500.80, 'user-04', 'ACTIVE', NOW(), NOW()),
  ('acc-12', 'Reserva de Emergência', 'SAVINGS', 25000.00, 'user-04', 'ACTIVE', NOW(), NOW()),
  ('acc-13', 'Carteira Digital PicPay', 'WALLET', 150.20, 'user-04', 'ACTIVE', NOW(), NOW()),

  -- Contas do Carlos Fernandes
  ('acc-14', 'Conta Empresarial Principal', 'CHECKING', 85000.00, 'user-05', 'ACTIVE', NOW(), NOW()),
  ('acc-15', 'Conta Pessoa Física', 'CHECKING', 12000.00, 'user-05', 'ACTIVE', NOW(), NOW()),
  ('acc-16', 'Fundos de Investimento', 'INVESTMENT', 350000.00, 'user-05', 'ACTIVE', NOW(), NOW()),
  ('acc-17', 'Cartão American Express', 'CREDIT_CARD', -3500.00, 'user-05', 'ACTIVE', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Verificação dos dados inseridos
SELECT 'Genders' as tabela, COUNT(*) as total FROM "Gender"
UNION ALL
SELECT 'Professions' as tabela, COUNT(*) as total FROM "Profession"
UNION ALL
SELECT 'PostCategories' as tabela, COUNT(*) as total FROM "PostCategory"
UNION ALL
SELECT 'Profiles' as tabela, COUNT(*) as total FROM "Profile"
UNION ALL
SELECT 'Users' as tabela, COUNT(*) as total FROM "User"
UNION ALL
SELECT 'Accounts' as tabela, COUNT(*) as total FROM "Account";
