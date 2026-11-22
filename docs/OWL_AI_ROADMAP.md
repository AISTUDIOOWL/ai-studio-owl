# OWL_AI Evolution — roadmap online

A seção **OWL_AI Evolution** foi integrada ao site na âncora `#roadmap`.

## Fonte dinâmica

- Dados publicados: `public/data/owl-ai-roadmap.json`
- Componente TypeScript: `src/owl-ai-roadmap.ts`
- Estilos: `src/owl-ai-roadmap.css`
- Montagem: `src/main.ts`
- Endpoint público estático: `/data/owl-ai-roadmap.json`

O componente carrega o JSON ao iniciar, quando a aba volta a ficar visível e no intervalo definido em `refreshIntervalSeconds` (entre 30 e 300 segundos; padrão 60). O navegador não publica alterações locais: para que visitantes vejam uma atualização, o JSON deve ser alterado, versionado e publicado em um novo deploy.

## Como registrar uma versão ou atualização

1. Edite `public/data/owl-ai-roadmap.json`.
2. Atualize os status das tarefas (`completed`, `in_progress`, `planned` ou `blocked`) com base em evidências/testes reais.
3. Atualize `roadmapVersion`, `currentRelease` e `updatedAt`.
4. Adicione uma entrada cronológica em `changelog`.
5. Execute `npm run build` e revise `git diff`.
6. Faça commit/push pelo fluxo de release do projeto e publique o deploy.
7. Após o deploy, os visitantes recebem a nova versão pelo polling do componente, sem precisar de uma nova alteração no TypeScript.

O `vercel.json` define `Cache-Control: no-store` para o JSON do roadmap para evitar que visitantes continuem vendo uma versão antiga durante o polling.

## Modo Experimental

O widget único de `src/owl-ai.ts` é identificado com o selo **EXPERIMENTAL** e uma nota de cautela em EN, PT-BR e ES. O objetivo é deixar claro que as respostas generativas/estratégicas ainda estão em avaliação.

Modelo oficial: **Qwen3 1.7B Instruct GGUF Q4_K_M**, servido por llama.cpp b12532. `127.0.0.1:8080` é endereço somente local; a operação pública depende de um endpoint remoto protegido e de variáveis de ambiente server-side.

## Estado desta integração

Este pacote integra o componente ao site e atualiza o JSON inicial para a versão de roadmap 1.1.0. O estado inicial registra 11 tarefas concluídas de 30 (37%), 9 em andamento e 10 planejadas. O progresso representa o checklist documentado, não uma certificação de prontidão de produção.

Ainda não estão aprovados: validação estratégica completa no Qwen3 real, testes de acessibilidade/mobile, auditoria de segurança de produção, Cloudflare Tunnel/Access, configuração de produção Vercel e teste ponta a ponta na URL pública.
