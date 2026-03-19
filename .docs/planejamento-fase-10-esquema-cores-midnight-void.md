PLANEJAMENTO — FASE 10 — ESQUEMA DE CORES MIDNIGHT VOID

Objetivo
Atualizar o Design System para o esquema Midnight Void e habilitar alternância entre modo escuro e claro no header.

Paleta e uso
- Midnight Void #08090F — fundo principal
- Intelligence Blue #2B7FFF — CTA, links, ação primária
- Optimal Teal #00D9B4 — sucesso e estado ótimo
- Deep Carbon #1C2235 — cards e superfícies
- Arctic Mist #EEF2FF — background light mode
- Optimal #00C896 — acento positivo
- Warning #F5A623 — atenção
- Alert #FF4D4D — alertas e erros
- Info #7C9EFF — informação

Arquivos impactados
- apps/frontend/src/styles/globals.css
- apps/frontend/tailwind.config.ts
- apps/frontend/src/layouts/LayoutDesktop.tsx
- .docs/GlucoIA_PRD_Supremo.md
- .docs/GlucoIA_Roadmap_Detalhado.md

Etapas
1. Atualizar tokens globais no globals.css com a nova paleta
2. Alinhar cores utilitárias do Tailwind aos tokens Midnight Void
3. Implementar toggle de tema no header com persistência
4. Ajustar PRD com paleta e variáveis oficiais atualizadas
5. Registrar a fase e tarefas no Roadmap

Critérios de aceite
- Fundo principal escuro aplicado via token global
- Tailwind refletindo a nova paleta
- Toggle de tema disponível ao lado do sino de alertas
- PRD e Roadmap atualizados com a nova fase
- Visual consistente com Midnight Void em componentes base

Validação
- Rodar lint e typecheck do monorepo
- Rodar npx tsc --noEmit para checagem estrita de TypeScript
