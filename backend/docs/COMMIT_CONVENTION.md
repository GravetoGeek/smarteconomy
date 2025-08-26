# Padrão de Commits com Emojis

Este projeto utiliza emojis para identificar rapidamente o tipo de alteração em cada commit. Siga a tabela abaixo para garantir consistência e facilitar a revisão do histórico.

| Tipo do Commit         | Emoji         | Palavra-chave      |
|-----------------------|--------------|-------------------|
| Acessibilidade        | ♿ :wheelchair:      |                  |
| Adicionando um teste  | ✅ :white_check_mark:| test             |
| Atualizando submódulo | ⬆️ :arrow_up:      |                  |
| Retrocedendo submódulo| ⬇️ :arrow_down:    |                  |
| Adicionando dependência| ➕ :heavy_plus_sign:| build            |
| Revisão de código     | 👌 :ok_hand:        | style            |
| Animações/transições  | 💫 :dizzy:         |                  |
| Bugfix                | 🐛 :bug:           | fix              |
| Comentários           | 💡 :bulb:          | docs             |
| Commit inicial        | 🎉 :tada:          | init             |
| Configuração          | 🔧 :wrench:        | chore            |
| Deploy                | 🚀 :rocket:        |                  |
| Documentação          | 📚 :books:         | docs             |
| Em progresso          | 🚧 :construction:  |                  |
| Estilização interface | 💄 :lipstick:      | feat             |
| Infraestrutura        | 🧱 :bricks:        | ci               |
| Lista de ideias       | 🔜 :soon:          |                  |
| Mover/Renomear        | 🚚 :truck:         | chore            |
| Novo recurso          | ✨ :sparkles:      | feat             |
| Package.json JS       | 📦 :package:       | build            |
| Performance           | ⚡ :zap:           | perf             |
| Refatoração           | ♻️ :recycle:       | refactor         |
| Limpeza de código     | 🧹 :broom:         | cleanup          |
| Removendo arquivo     | 🗑️ :wastebasket:   | remove           |
| Removendo dependência | ➖ :heavy_minus_sign:| build          |
| Responsividade        | 📱 :iphone:        |                  |
| Revertendo mudanças   | 💥 :boom:          | fix              |
| Segurança             | 🔒️ :lock:         |                  |
| SEO                   | 🔍️ :mag:          |                  |
| Tag de versão         | 🔖 :bookmark:      |                  |
| Teste de aprovação    | ✔️ :heavy_check_mark:| test          |
| Testes                | 🧪 :test_tube:     | test             |
| Texto                 | 📝 :pencil:        |                  |
| Tipagem               | 🏷️ :label:        |                  |
| Tratamento de erros   | 🥅 :goal_net:      |                  |
| Dados                 | 🗃️ :card_file_box: | raw              |

## Exemplos

```bash
:tada: Commit inicial
:books: docs: Atualização do README
:bug: fix: Loop infinito na linha 50
:sparkles: feat: Página de login
:bricks: ci: Modificação no Dockerfile
:recycle: refactor: Passando para arrow functions
:zap: perf: Melhoria no tempo de resposta
:boom: fix: Revertendo mudanças ineficientes
:lipstick: feat: Estilização CSS do formulário
:test_tube: test: Criando novo teste
:bulb: docs: Comentários sobre a função LoremIpsum( )
:card_file_box: raw: RAW Data do ano aaaa
:broom: cleanup: Eliminando blocos de código comentados e variáveis não utilizadas
:wastebasket: remove: Removendo arquivos não utilizados do projeto
```

## Como usar
- Sempre inicie a mensagem de commit com o emoji correspondente.
- Use a palavra-chave para facilitar buscas e filtros.
- Consulte esta tabela antes de cada commit.
