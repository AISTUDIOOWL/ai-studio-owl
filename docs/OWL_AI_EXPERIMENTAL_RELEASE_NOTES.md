# AI STUDIO OWL — pacote integrado OWL_AI Experimental

Data do pacote: 22/11/2026  
Release do roadmap: 1.1.0  
Canal: EXPERIMENTAL — integração local; ainda não é um lançamento público validado.

## Conteúdo integrado

- Widget único `src/owl-ai.ts`, identificado visualmente como EXPERIMENTAL em PT-BR, EN e ES.
- API server-side em `api/owl-ai.js`.
- Modelo oficial Qwen3 1.7B Instruct GGUF Q4_K_M, usando llama.cpp b12532. BitNet não é usado.
- Conhecimento GRIDBREAKERS em `api/_lib/knowledge.js`.
- Respostas factuais determinísticas de habilidades/ultimates em `api/_lib/combat-answers.js`.
- Creative Guard em `api/_lib/creative-guard.js`.
- Regras de estratégia para separar habilidade básica e ultimate, não inventar efeitos e respeitar a quantidade de itens solicitada.
- Limite de timeout da API em 240 segundos; limite de segurança de streaming de 400 KB; respostas com conhecimento até 480 tokens, conforme o código deste snapshot.
- Roadmap online integrado à navegação e à página principal, em `src/owl-ai-roadmap.ts` e `src/owl-ai-roadmap.css`.
- Dados do roadmap servidos por `public/data/owl-ai-roadmap.json`, com polling padrão de 60 segundos, atualização ao retornar à aba e botão de atualização manual.
- Cabeçalho Vercel de não-cache para o JSON do roadmap.

## Como atualizar o roadmap após uma nova versão

1. Edite `public/data/owl-ai-roadmap.json`.
2. Atualize `roadmapVersion`, `updatedAt`, `currentRelease`, estados dos itens e o histórico `changelog`.
3. Mantenha `schemaVersion: 1` e as traduções `en` e `es` completas.
4. Execute `npm run test:owl-ai` e `npm run build`.
5. Faça commit/push e deploy. Os visitantes receberão o JSON atualizado na próxima consulta automática (60 segundos por padrão), ao reabrir a aba ou ao pressionar Atualizar.

O browser não pode detectar alterações que ainda não foram publicadas no servidor. A atualização automática começa depois do deploy do JSON.

## Validações executadas para este pacote

- `node --check` nos módulos JavaScript da API e conhecimento: passou.
- `npm run test:owl-ai`: passou — 8 heróis × 3 idiomas, roteamento estratégico, seleção de conhecimento, limites da API e schema do roadmap (30 itens).
- Transpilação sintática TypeScript: passou para 27 arquivos de implementação.
- TypeScript strict focado em `src/owl-ai.ts` e `src/owl-ai-roadmap.ts`, com declarações locais de Vite/CSS: passou.
- Conferência do ZIP original: integridade CRC aprovada; nenhum `.env.local`, `.git`, `node_modules`, `dist` ou arquivo `*.backup*` incluído.

## Validação ainda necessária no computador do desenvolvedor

- Executar `npm ci` e `npm run build` no Windows com a rede e dependências instaladas. O build integral não pôde ser executado neste ambiente de empacotamento porque a resolução DNS do registry npm estava indisponível.
- Iniciar o llama-server Qwen3 real e executar testes ponta a ponta para perguntas factuais, estratégicas, criativas e streaming longo.
- Conferir visualmente o widget e o roadmap nos temas Neon e Desert Marble, desktop e mobile.
- Verificar que as recomendações estratégicas usam apenas as habilidades documentadas; o prompt reduz alucinações, mas não substitui validação do modelo real.
- Configurar infraestrutura pública protegida para o Qwen3 (por exemplo, Cloudflare Tunnel + Access) e variáveis server-side da Vercel antes de publicar para visitantes.
- Revisar segurança, branch Git, diferenças locais e arquivos antigos antes de commit/push. O pacote não inclui `.git` nem `.env.local`.

## Segurança e preservação

Este pacote é um snapshot de código-fonte. Não contém credenciais, `.env.local`, histórico Git, dependências instaladas nem build. Ao aplicá-lo por cima do repositório atual, faça backup primeiro. Como `.git` e `.env.local` não estão no ZIP, eles não são substituídos pela extração.
