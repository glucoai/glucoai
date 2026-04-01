# Plano de refatoração e componentização — WhatsApp

## Objetivo
Reduzir o acoplamento e o tamanho do `service.ts`, isolando mensagens, fluxos, roteamento e parsing em módulos menores, mantendo comportamento atual e melhorando testabilidade e manutenção.

## Diagnóstico do arquivo atual
- O arquivo concentra mensagens, regras de fluxo, parsing de dados, chamadas à API do WhatsApp e lógica de onboarding.
- Mistura de responsabilidades em funções longas e blocos condicionais extensos, especialmente no processamento de fluxo e na roteirização.
- Alto risco de regressão ao editar mensagens ou regras, pois estão espalhadas em múltiplos pontos.

## Eixos principais de componentização
1. **Mensagens e textos**: centralizar todo conteúdo textual em um catálogo único.
2. **Fluxos de onboarding**: separar cada etapa (flow01/02/03) em handlers dedicados.
3. **Roteamento de mensagens**: isolar regras de classificação e fallback.
4. **Parsing/normalização**: concentrar regras de parsing e normalização de dados em utilitários.
5. **Cliente WhatsApp**: encapsular envio de texto, botões e flow com retry.
6. **Orquestração**: manter `service.ts` apenas como fachada que integra os módulos.

## Regras rígidas de preservação funcional
- Não alterar o fluxo nem a ordem dos flows (FLOW01 → FLOW02 → FLOW03).
- Não alterar textos, emojis, quebras de linha ou termos usados nas mensagens.
- Não alterar gatilhos, palavras-chave, intents ou rotas existentes.
- Não alterar nomes de etapas de onboarding, chaves do flow ou payloads enviados.
- Não alterar temporizações (delays) e regras de retry.
- Não remover logs existentes; apenas realocar mantendo conteúdo.
- Não mudar comportamento de fallback e mensagens de erro.
- Refatoração apenas estrutural: mover código sem mudar lógica.

## Proposta de estrutura de pastas (backend)
```
apps/backend/src/modulos/whatsapp/
  messages/
    index.ts
    onboarding.ts
    menu.ts
    termos.ts
    gestacional.ts
    respostas.ts
  flows/
    flow01.ts
    flow02.ts
    flow03.ts
    index.ts
  handlers/
    processarMensagem.ts
    processarWebhook.ts
  routing/
    roteadorMensagem.ts
    gatilhos.ts
  parsing/
    normalizacao.ts
    extracao.ts
    validacao.ts
  client/
    whatsappClient.ts
  service.ts
```

## Mapeamento de extrações sugeridas
### Mensagens
- `menuMensagem`, textos de convite, “como funciona”, mensagens de termos, gestacional, respostas padrão e templates de análise.
- Separar em arquivos com exportação clara por contexto (ex.: `onboarding.ts`, `termos.ts`).

### Fluxos
- `processarRespostaFlow01`, `processarRespostaFlow02`, `processarRespostaFlow03`.
- Criar contratos de entrada/saída e objetos com dados derivados.
- Isolar regras específicas: gestacional, sem glicosímetro, termos.

### Roteamento
- `rotearMensagem` e regras de gatilhos de onboarding.
- Unificar palavras-chave e intents em um único módulo (`routing/roteadorMensagem.ts`).

### Parsing e normalização
- `normalizarTelefone`, `normalizarResposta`, `normalizarChave`.
- `obterValorPorChaves`, `parsearNumero`, `parsearBooleano`, `parsearDataNascimento`.
- Extrações de dados do flow e cálculo de `idade`, `imc`, `macros`, `risco`.

### Cliente WhatsApp
- `enviarTextoWhatsApp`, `enviarBotoesWhatsApp`, `enviarFlowDireto`.
- Criar interface única com retry e logs padronizados.

### Orquestração
- `processarMensagem`, `processarWebhook`, `processarWebhookComNumero` permanecem em `service.ts`, mas com chamadas para módulos dedicados.

## Plano de refatoração por etapas
1. **Criar catálogo de mensagens**
   - Extrair todos os textos para `messages/`.
   - Substituir referências diretas por importações.
2. **Isolar parsing e normalização**
   - Mover utilitários para `parsing/`.
   - Ajustar imports e manter testes manuais por logs.
3. **Separar roteamento**
   - Mover `rotearMensagem` e `gatilhosFlow` para `routing/`.
   - Garantir que regras atuais fiquem idênticas.
4. **Extrair cliente WhatsApp**
   - Centralizar envios e retry em `client/whatsappClient.ts`.
   - Padronizar logs de sucesso/erro.
5. **Modularizar flows**
   - Criar arquivos `flows/flow01.ts`, `flow02.ts`, `flow03.ts`.
   - Explicitar dependências (repos, parsing, mensagens).
6. **Refatorar orquestração**
   - Reduzir `service.ts` para fachada: validação, chamadas e exportações.

## Critérios de sucesso
- `service.ts` <= 200 linhas.
- Funções <= 40 linhas por regra do projeto.
- Zero mudança de comportamento observável nos fluxos.
- Mensagens centralizadas e reutilizáveis.
 - Regras rígidas de preservação funcional atendidas.

## Riscos e mitigação
- **Risco**: alteração involuntária de mensagens.
  - **Mitigação**: mover mensagens sem alterar conteúdo e revisar diff.
- **Risco**: regressão de flow.
  - **Mitigação**: logs atuais preservados e comparação de respostas.

## Próximos passos sugeridos
- Implementar etapa 1 (catálogo de mensagens).
- Validar com execução de cenários críticos: menu, histórico, escore, flow01/02/03, termos e gestacional.
