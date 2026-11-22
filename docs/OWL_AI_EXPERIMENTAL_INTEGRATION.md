# OWL_AI — integração Experimental e roadmap online

## O que foi integrado neste pacote

- Mantido o único widget já utilizado por `src/main.ts` (`src/owl-ai.ts` + `src/owl-ai.css`).
- Adicionado o selo visual **EXPERIMENTAL** ao cabeçalho do widget e um aviso correspondente no rodapé do chat, em EN, PT-BR e ES.
- Integrado o componente de evolução em `src/owl-ai-roadmap.ts` e `src/owl-ai-roadmap.css`.
- Substituída a seção de roadmap estático da página principal por um componente que lê `public/data/owl-ai-roadmap.json`.
- Adicionado link `OWL_AI` à navegação principal.
- Configurado o JSON do roadmap com `Cache-Control: no-store` na Vercel.
- O componente atualiza o JSON no carregamento, ao retornar à aba e em intervalos de 30 a 300 segundos conforme `refreshIntervalSeconds` (padrão 60 s).
- Adicionadas regras de estratégia ao prompt server-side para separar skill básica/ultimate e evitar efeitos não documentados.

## Como atualizar o roadmap

1. Edite `public/data/owl-ai-roadmap.json`.
2. Ajuste o status das tarefas (`completed`, `in_progress`, `planned` ou `blocked`) somente com base em testes reais.
3. Atualize `roadmapVersion`, `currentRelease` e `updatedAt`.
4. Adicione um item em `changelog`.
5. Execute `npm run build` e revise o diff.
6. Faça o commit/push pelo fluxo Git normal e publique o deploy.

O navegador consulta o JSON automaticamente após a nova versão estar publicada. A atualização do navegador não publica arquivos locais por conta própria.

## Modo Experimental

O widget único `src/owl-ai.ts` mostra o selo `EXPERIMENTAL`. Isso significa que a OWL_AI está disponível para avaliação e que respostas generativas/estratégicas podem conter erros. O Qwen3 1.7B continua sendo o modelo oficial. A integração pública depende de configurar o acesso externo protegido ao servidor do modelo; `127.0.0.1` só atende ao ambiente local.

## Estado de validação

- O ZIP de origem já continha a arquitetura Qwen3 server-side, respostas factuais, roteamento estratégico, timeout de 240 s e limite de segurança SSE de 400 KB.
- Este pacote integra a experiência Experimental e o roadmap ao site e adiciona um reforço de prompt para estratégia.
- A compilação deste pacote deve ser executada no ambiente do projeto.
- Ainda precisam de testes reais: respostas estratégicas completas com Qwen3, os dois temas, mobile, acessibilidade, oito heróis em três idiomas e publicação Vercel.

## Segurança e preservação

- Não distribuir `.env.local`, chaves, credenciais Cloudflare ou chaves do llama-server.
- Não colocar `LLAMA_API_KEY` / `OWL_AI_API_KEY` em variáveis `VITE_*` ou em `public/`.
- Não substituir Qwen3 por BitNet.
- Não publicar backups, `node_modules`, `.git` ou builds antigos.
