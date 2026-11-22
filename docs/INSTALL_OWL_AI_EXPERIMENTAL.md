# Instalar o pacote OWL_AI Experimental no Windows

Este ZIP é um snapshot completo do código-fonte do AI STUDIO OWL, incluindo o site, os assets e a pasta `public/gridbreakers`. Por segurança e tamanho, ele não contém `.git`, `.env.local`, `node_modules` nem `dist`.

## Opção recomendada: aplicar sobre uma cópia do projeto atual

1. Feche o Vite e o llama-server.
2. Faça uma cópia de segurança da pasta atual `C:\AI_STUDIO_OWL_GITHUB`.
3. Extraia o ZIP para uma pasta temporária e confira os arquivos.
4. Para testar isoladamente, copie seu `.env.local` da pasta original para a pasta de teste; não o compartilhe nem o publique.
5. Abra PowerShell na pasta extraída e execute `npm ci` e `npm run build`.
6. Inicie o Qwen3 localmente e depois `npm run dev`.

## Aplicar diretamente ao repositório existente

Se preferir atualizar `C:\AI_STUDIO_OWL_GITHUB`, faça primeiro um backup completo. Extraia o ZIP por cima com `Expand-Archive -Force`. Como o ZIP não contém `.git` nem `.env.local`, esses itens existentes não são substituídos. Revise `git status` antes de adicionar arquivos; não use `git add .` sem conferir os backups e os patches.

## Executar localmente

- Modelo oficial: Qwen3 1.7B Instruct GGUF Q4_K_M.
- Runtime: llama.cpp b12532, CPU, local em `127.0.0.1:8080`.
- Site: `npm run dev` (normalmente `http://localhost:5173`).
- Health da API: `http://localhost:5173/api/owl-ai`.

Use o comando de inicialização Qwen3 já documentado em `docs/OWL_AI.md` e mantenha a mesma chave em `.env.local` e no `llama-server --api-key`, caso a autenticação local esteja habilitada.

## Importante

O widget está marcado como EXPERIMENTAL. O modo local pode funcionar sem que a versão pública esteja pronta. Para produção, configure primeiro um endpoint externo protegido para o Qwen3, as variáveis server-side da Vercel e Cloudflare Access/Tunnel; nunca publique `127.0.0.1` como URL do modelo para visitantes.
