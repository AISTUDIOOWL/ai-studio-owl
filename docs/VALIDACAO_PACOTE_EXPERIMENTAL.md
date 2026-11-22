# Relatório de validação do pacote Experimental

Data do pacote: 22/11/2026

## Verificações concluídas nesta sessão de empacotamento

- Estrutura do ZIP de origem lida e CRC verificado sem erros.
- Confirmada a existência da aplicação do site, API, temas, widget único e código do GRIDBREAKERS em `public/gridbreakers` e `client`.
- Confirmado que o `main.ts` já importava o widget `src/owl-ai.ts`; a integração preserva esse widget e adiciona o selo EXPERIMENTAL.
- Roadmap integrado em `#roadmap`, com link de navegação e dados em `public/data/owl-ai-roadmap.json`.
- JSON do roadmap validado, com 30 tarefas: 11 concluídas, 9 em andamento e 10 planejadas (37%).
- Respostas factuais e roteamento estratégico verificados por testes de módulo: perguntas factuais da Kira continuam determinísticas; pergunta estratégica com Kira, Kai e Titan retorna ao Qwen3; a seleção de conhecimento inclui a seção de combate e os três heróis.
- `node --check` aprovado para `api/owl-ai.js`, `knowledge.js`, `creative-guard.js` e `combat-answers.js`.
- TypeScript em modo estrito aprovado para `src/owl-ai.ts` e `src/owl-ai-roadmap.ts`, com stubs locais para tipos Vite/CSS.
- Verificação de padrões comuns de chaves e arquivos privados não encontrou `.env.local`, chaves privadas ou valores de API no snapshot recebido.

## Limitação da validação

O build integral `npm run build` não pôde ser executado neste ambiente de empacotamento: o ZIP não inclui `node_modules` e o ambiente não conseguiu resolver `registry.npmjs.org` para concluir `npm ci`. Por isso, esta entrega não afirma que o build completo foi aprovado aqui. Execute `npm ci` (se necessário) e `npm run build` no Windows do projeto antes de commit/push.

## Ainda não validado

- Teste completo de UI no navegador após a nova integração.
- Estratégia do Qwen3 real com respostas completas e fiéis aos dados.
- Visualização em Neon e Desert Marble, mobile e acessibilidade.
- Cloudflare Tunnel/Access, variáveis Vercel e resposta na URL pública.
