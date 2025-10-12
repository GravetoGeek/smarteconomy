#!/bin/bash

# Script para corrigir todos os erros de TypeScript relacionados ao Store Context
# Substitui useContext(Store) por useStore() em todos os arquivos

echo "🔧 Corrigindo erros de TypeScript no StoreContext..."

# Lista de arquivos a serem corrigidos
files=(
    "frontend/src/screens/login/index.tsx"
    "frontend/src/screens/register/index.tsx"
    "frontend/src/screens/addAccount/index.tsx"
    "frontend/src/screens/listTransactions/index.tsx"
    "frontend/src/screens/manageTransaction/index.tsx"
    "frontend/src/screens/manageProfile/index.tsx"
    "frontend/src/screens/dashboard/index.tsx"
    "frontend/src/screens/addTransaction/index.tsx"
    "frontend/src/components/Header/index.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  📝 Corrigindo $file..."

        # Substituir import do Store pelo useStore
        sed -i "s/import {Store} from '..\/..\/..\/contexts\/StoreProvider'/import {useStore} from '..\/..\/..\/hooks\/useStore'/g" "$file"
        sed -i "s/import {Store} from '..\/..\/contexts\/StoreProvider'/import {useStore} from '..\/..\/hooks\/useStore'/g" "$file"

        # Substituir useContext(Store) por useStore()
        sed -i 's/useContext(Store)/useStore()/g' "$file"

        # Remover import de useContext se não for mais usado
        # (isso precisa ser verificado manualmente)
    else
        echo "  ⚠️  Arquivo não encontrado: $file"
    fi
done

echo "✅ Correção concluída!"
echo ""
echo "📋 Próximos passos manuais:"
echo "1. Verifique se algum arquivo ainda usa useContext para outras coisas"
echo "2. Execute 'npm run lint' para verificar erros restantes"
echo "3. Execute 'npm run build' para garantir que tudo compila"
