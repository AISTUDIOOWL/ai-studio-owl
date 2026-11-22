# OWL_AI — AI Studio OWL assistant

**Official model:** Qwen3 1.7B Instruct, GGUF Q4_K_M (`Qwen3-1.7B-Q4_K_M.gguf`), app identifier `qwen3-1.7b`.
Server: llama.cpp **b12532** (`llama-server`), CPU only, `127.0.0.1:8080`.
SHA256: `D2387CA2DBFEE2FFABCE7120D3770DADCA0B293052BC2F0E138FDC940D9BC7B5`.
BitNet b1.58 2B-4T is discarded (it does not load in b12532: removed type `IQ4_NL_4_4`). Do not replace Qwen3 with BitNet.

## Architecture (one OWL_AI)
```
Browser widget (src/owl-ai.ts)  ->  /api/owl-ai (Vercel function / Vite dev middleware)  ->  llama-server
```
- Normal questions: streamed. Only the relevant GRIDBREAKERS sections (`api/_lib/knowledge.js`) are added to the prompt.
- Creative requests (design ideas about GRIDBREAKERS): non-streamed -> Creative Guard v2 (`api/_lib/creative-guard.js`) -> one retry with the reason -> answer, or a polite failure message. The connection sends `: ping` keepalives meanwhile.
- Single-hero skill questions (8 heroes, PT-BR/EN/ES) are answered deterministically by `api/_lib/combat-answers.js` without calling the model; team/strategy questions or several heroes go to Qwen3. Keep its data in sync with `knowledge.js`.
- Team/strategy questions are generated non-streamed and checked by `api/_lib/strategy-guard.js` (undocumented effects such as crit protection or damage reduction, Kai's 55% outside the ultimate, Titan shielding the team, wrong item count, truncated answers), with one retry; disable with `OWL_AI_STRATEGY_VALIDATE=0`.
- `GET /api/owl-ai` returns `{"status":"ok"|"offline"}`.
- Hardening: Origin allow-list, per-IP rate limit (creative costs 3), max simultaneous generations, input sanitising, prompt-injection replies, no upstream URL/error leaks. The browser never sees the model server or its key.

## Run locally (Windows, PowerShell)
1. Start the model (adapt paths; keep the key out of chat/logs):
   `.\llama-server.exe -m .\models\Qwen3-1.7B-Q4_K_M.gguf --host 127.0.0.1 --port 8080 --jinja -c 4096 -b 128 -ub 32 -t 4 --api-key <KEY> --alias qwen3-1.7b`
2. In `.env.local` set `OWL_AI_API_KEY` to the same `<KEY>` (see `.env.example`).
3. `npm run dev` and open the site on localhost; click the owl button.

## Known limits
- Creative Guard is a regex heuristic tuned for Portuguese requests. It does not catch synonyms (e.g. "sortear herois" for gacha) and does little in EN/ES.
- Rate limiting is in-memory (best effort on serverless).
- Production needs the model reachable from Vercel (Cloudflare Tunnel + Access service token, `CF_ACCESS_*`); `127.0.0.1` is not reachable by visitors. Vercel function duration limits apply to creative mode.
- Knowledge is verified against `public/gridbreakers/js/01-core-v146.js` (v3.7.x); several version identifiers exist in the docs, so never state one global "current" version.
