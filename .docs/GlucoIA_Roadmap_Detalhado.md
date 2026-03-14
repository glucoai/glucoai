
GLUCO
IA


ROADMAP DETALHADO v2
9 Fases · Mobile-first + Dashboard Clínico · Prompts para IDE · PT-BR

Campo
Detalhe
Projeto
Gluco IA — AI Metabolic Assistant
Fases
9 Fases de Desenvolvimento
Estimativa
16 a 24 semanas (equipe 2-3 devs)
Metodologia
Sprints de 2 semanas com entregável funcional
UI/UX
Mobile-first + Dashboard Clínico — todas as telas especificadas
Idioma
Português BR em toda a interface
Formato
Prompt-first: cada fase com instrução para IDE


VISÃO GERAL — 9 FASES
Cada fase termina com entregável funcional e testável. Não avance sem o critério de aceite cumprido.

Fase
Prazo
Entregável Principal
Critério de Aceite
F1
Sem 1-2
Monorepo + Ambiente + Design System base
pnpm dev funciona; globals.css com tokens Gluco IA
F2
Sem 2-3
Docker + PostgreSQL + Redis + Prisma
docker compose up; migrations OK; seed com dados demo
F3
Sem 3-5
Autenticação + Tela de Login + Layout Base
Login JWT funciona; sidebar + layout PT-BR
F4
Sem 5-8
Pacientes + Glicemia + Dashboard
Gauge glicemia; KPIs; tabela de pacientes com sparkline
F5
Sem 8-10
Integração WhatsApp
Paciente envia '120' → registrado; menu PT-BR funciona
F6
Sem 10-13
IA (GPT-4o + Vision API)
Análise glicemia + refeição; resposta PT-BR em < 30s
F7
Sem 13-15
Financeiro (Stripe)
Checkout; webhook; controle de assinatura
F8
Sem 15-17
Mensagens + Heatmap + Relatórios
Chat PT-BR; heatmap de adesão; exportar PDF
F9
Sem 17-22
Deploy + CI/CD + Lançamento
HTTPS; CI passando; monitoramento ativo


FASE 1  ·  SETUP DO PROJETO
⏱  1-2 semanas
🟢 Concluído


📋 Tarefas
🟢  📁  Criar estrutura de monorepo (pnpm workspaces)
🟢  ⚡  Configurar Vite + React 18 + TypeScript strict
🟢  🚀  Configurar Node 20 + Fastify + TypeScript
🟢  🎨  Tailwind com tokens Gluco IA (cores, fontes, sombras)
🟢  🔤  Fontes Inter + Poppins via Google Fonts
🟢  📐  Componentes base PT-BR: BotaoPrimario, CampoTexto, Card
🟢  🌍  globals.css com todas as variáveis CSS do Design System
🟢  📏  ESLint + Prettier + path aliases configurados
🟢  ✅  pnpm dev sobe frontend :5173 e backend :3000

🤖  PROMPT IDE — FASE 1 — SETUP COMPLETO
Crie monorepo pnpm para o Gluco IA:

ESTRUTURA:
  gluco-ia/
    pnpm-workspace.yaml
    tsconfig.base.json
    .eslintrc.base.json / .prettierrc
    apps/frontend/  apps/backend/
    packages/ui/    packages/tipos/   packages/utils/
    workers/ia-worker/   infra/docker/   infra/nginx/

FRONTEND:
  - Vite 5 + React 18 + TypeScript strict
  - Tailwind com tema customizado:
    colors: { primaria:'#2F80ED', sucesso:'#27AE60',
              atencao:'#F2994A',  perigo:'#EB5757',
              texto:'#4F4F4F',    superficie:'#F5F7FA' }
  - Fontes Inter + Poppins no index.html via Google Fonts
  - globals.css com variáveis CSS completas (ver PRD seção 01)
  - React Query v5 + Zustand + React Router v6 + Recharts

BACKEND:
  - Node 20 + Fastify 4 + TypeScript
  - Zod, dotenv, path aliases
  - GET /saude → { status: 'ok', versao: '1.0.0' }

packages/ui/src — componentes PT-BR:
  BotaoPrimario, BotaoSecundario, BotaoPerigo, BotaoGhost
  CampoTexto, CampoGlicemia, SeletorContexto
  Card, BadgeTipoDiabetes, BadgeStatusGlicemia
  GaugeGlicemia (SVG circular com animação)
  BarraNavegacaoInferior (mobile, 5 itens)

ENTREGÁVEL: pnpm dev → frontend exibe logo 'GLUCO IA'
  com azul/verde, fonte Poppins; backend responde /saude


FASE 2  ·  INFRAESTRUTURA
⏱  1 semana
🟢 Concluído


📋 Tarefas
🟢  🐳  docker-compose.yml com postgres + redis
🟢  🗄️  PostgreSQL 17 com volume persistente e healthcheck
🟢  ⚡  Redis 7 com autenticação
🟢  🔮  Prisma ORM com schema completo PT-BR
🟢  🌱  Migration inicial + seed com dados demo
🟢  📋  arquivos .env.example para todos os apps

🤖  PROMPT IDE — FASE 2 — DOCKER + BANCO + PRISMA
Configure a infraestrutura completa:

infra/docker/docker-compose.dev.yml:
  postgres: postgres:16-alpine, porta 5432
  redis: redis:7-alpine, porta 6379

prisma/schema.prisma — models em PT-BR:
  model Clinica, model Usuario (perfil: ADMINISTRADOR|PROFISSIONAL)
  model Paciente (tipoDiabetes: TIPO_1|TIPO_2|GESTACIONAL|PRE)
  model Glicemia (contexto: JEJUM|APOS_CAFE|APOS_ALMOCO|...)
  model Refeicao, model Mensagem, model Assinatura, model Pagamento
  @@index em Glicemia[pacienteId, registradoEm]
  @@index em Mensagem[pacienteId, criadoEm]

.env.example (backend):
  URL_BANCO=postgresql://glucoia:dev123@localhost:5432/glucoia
  URL_REDIS=redis://:dev123@localhost:6379
  JWT_SEGREDO=minimo-32-caracteres-troque-em-producao
  OPENAI_CHAVE=sk-...
  WHATSAPP_TOKEN=
  STRIPE_CHAVE=sk_test_...

prisma/seed.ts:
  - Clinica: 'Clínica Demo Gluco IA'
  - Usuario admin: admin@glucoia.com / Admin@123
  - 3 Pacientes com tipos diferentes de diabetes
  - 30 Glicemias dos últimos 30 dias por paciente

ENTREGÁVEL: docker compose up + migrate + seed sem erros
  prisma studio mostra tabelas com dados demo


FASE 3  ·  AUTENTICAÇÃO + TELAS BASE
⏱  2 semanas
🟢 Concluído


📋 Tarefas — Backend
🟢  🔐  POST /autenticacao/entrar com Zod + Argon2 + JWT
🟢  🔄  POST /autenticacao/renovar com Redis
🟢  🚪  POST /autenticacao/sair — invalida token
🟢  🛡️  Middleware autenticarJWT e exigirPerfil
🟢  ⛔  Rate limit: 10 tentativas/15min por IP

📋 Tarefas — Frontend
🟢  📱  Tela de Login com identidade visual Gluco IA
🟢  🖥️  Layout desktop: SidebarNavegacao + Cabecalho + Area
🟢  📲  Layout mobile: BarraNavegacaoInferior 5 itens
🟢  🔀  Rotas protegidas por perfil (React Router)
🟢  🌍  Todos os textos, labels e placeholders em PT-BR
🟢  🚪  Logout no menu do usuário (desktop)

🤖  PROMPT IDE — FASE 3 — AUTH + LAYOUT (DESKTOP E MOBILE)
BACKEND:
  POST /autenticacao/entrar → JWT 15min + refreshToken 7d (Redis)
  Payload JWT: { usuarioId, email, perfil, clinicaId }
  Rate limit: 10 tentativas/15min por IP
  Argon2 para hash; Zod para validação

FRONTEND — Tela de Login:
  Fundo: #F5F7FA tela cheia
  Card centralizado: bg branco, raio 20px, sombra-card, max-w-md
  Logo: 'GLUCO' Poppins 700 #2F80ED + 'IA' Poppins 700 #27AE60
  Subtítulo: 'Tecnologia cuidando da sua glicemia.'
  Campos: 'E-mail' / 'Senha' (com mostrar/ocultar senha)
  Botão: 'Entrar' — BotaoPrimario azul com loading spinner
  Erro: alert vermelho #EB5757 com mensagem em PT-BR
  Após login: redireciona por perfil
    ADMINISTRADOR/PROFISSIONAL → /painel
    PACIENTE → /inicio

FRONTEND — Layout Desktop (/painel/*):
  SidebarNavegacao: 240px expanded / 64px colapsada
    bg branco, logo GLUCO IA oficial no topo
    Itens: Painel / Pacientes / Mensagens / Financeiro / Configurações
    Ícones premium (Lucide) + destaque azul no item ativo
  Cabecalho: 64px, bg branco, saudação com ícone premium
  Área: bg #F5F7FA, padding 24px, cards com borda sutil e sombra leve

FRONTEND — Layout Mobile (/inicio/*):
  Tela cheia sem sidebar
  BarraNavegacaoInferior: 64px bg branco
    Ícones premium (Lucide): Início / Glicemia / Refeições / Histórico / Perfil
    Ativo: ícone + label azul #2F80ED; inativo: cinza

Diretriz Visual Premium (aplicar em todas as futuras telas):
  - Sem emojis na UI
  - Ícones premium (Lucide) em ações e navegação
  - Sidebar branca, bordas sutis e sombras leves
  - Tipografia com hierarquia clara e tracking discreto
  - Espaços generosos, visual clean e superfícies claras


FASE 4  ·  PACIENTES + GLICEMIA + PAINEL
⏱  3 semanas
🟡 Em andamento


📋 Tarefas
🟢  👤  Backend: CRUD pacientes com Zod e soft delete
🟢  📊  Backend: rotas de glicemia + classificação automática
🟢  📈  Backend: /painel/estatisticas com cache Redis
🟢  📌  Backend: /painel/alertas → glicemias críticas últimas 24h
🟢  📈  Backend: /painel/graficos/glicemia → série 30 dias
🟢  🔢  Frontend: GaugeGlicemia SVG com animação
🟢  📋  Frontend: tabela de pacientes com sparkline inline
🟢  🏠  Frontend: Painel com KPIs + gráficos Recharts
🟢  📱  Frontend: tela inicial mobile com gauge grande
🟢  🗓️  Frontend: heatmap de adesão (estilo GitHub)

🤖  PROMPT IDE — FASE 4 — PACIENTES + GLICEMIA + PAINEL
BACKEND — PACIENTES:
  GET  /pacientes?busca=&tipo=&pagina=&limite=
  GET  /pacientes/:id → inclui última glicemia + última refeição
  POST /pacientes     → Zod: nome, telefone, tipoDiabetes...
  PUT  /pacientes/:id → atualização parcial
  DEL  /pacientes/:id → soft delete (ativo = false)

BACKEND — GLICEMIA:
  GET  /pacientes/:id/glicemias?de=&ate=&limite=
  GET  /pacientes/:id/glicemias/estatisticas
  POST /pacientes/:id/glicemias
  utils/classificarGlicemia.ts: 4 faixas com cor e label PT-BR

BACKEND — PAINEL:
  GET /painel/estatisticas → cache Redis 5 min
  GET /painel/alertas → glicemias críticas últimas 24h
  GET /painel/graficos/glicemia → série 30 dias

FRONTEND — GaugeGlicemia (packages/ui):
  SVG 200px (compacto: 48px), anel colorido por status
  Valor central Inter 36px bold; contexto 14px cinza
  stroke-dashoffset transition 0.8s ease

FRONTEND — Painel (desktop):
  Saudação: 'Bom dia, Dr. [Nome]! ☀️' — data atual
  Grid 4 KPI cards: sparkline Recharts 7d no rodapé
  LineChart 30 dias + ReferenceArea 70-140 verde
  TabelaAlertas com badge pulsante se crítico
  PainelIALateral 320px: 'Resumo do Dia' gerado por GPT

FRONTEND — TabelaPacientes:
  Colunas: Avatar | Nome | Telefone | Tipo | Glicemia | Ações
  GaugeCompacto 48px na coluna Glicemia
  SparklineMini 80x32px últimos 7 dias por linha
  ChipsFiltro: Todos/Tipo 1/Tipo 2/Gestacional/Atenção

FRONTEND — Tela Inicial Mobile:
  'Bom dia, [Nome]!' Poppins 22px + data
  GaugeGlicemia 200px centralizado
  Resumo do dia: 3 colunas (Proteína / Carbs / Cal)
  ListaRefeicoes com thumbnails 72px
  FAB azul 56px fixo no canto inferior direito


FASE 5  ·  INTEGRAÇÃO WHATSAPP
⏱  2 semanas
🟢 Concluído


📋 Tarefas
🟢  🔗  Configurar WhatsApp Business API (Meta for Developers)
🟢  📨  Webhook POST + GET com verificação de assinatura
🟢  🔀  RoteadorMensagens: número / foto / menu / histórico
🟢  🔍  Lookup de paciente por número de telefone
🟢  💬  EnviadorWhatsApp service com retry
🟢  📝  Salvar todas as mensagens na tabela mensagens
🟢  💌  Tela de chat no dashboard com layout PT-BR

🤖  PROMPT IDE — FASE 5 — WHATSAPP INTEGRATION
BACKEND (src/modulos/whatsapp):
  GET  /whatsapp/webhook → verificação Meta (hub.challenge)
  POST /whatsapp/webhook → recebe + valida assinatura HMAC-SHA256

  RoteadorMensagens.ts:
    isNumero(texto) → 'LEITURA_GLICEMIA'
    tipo === 'image' → 'FOTO_REFEICAO'
    texto em ['oi','olá','menu','ola'] → 'MENU'
    texto === 'histórico' → 'HISTORICO'
    default → 'DESCONHECIDO'

  Menu PT-BR enviado ao paciente:
    'Olá! Sou o assistente Gluco IA 🤖
     Você pode:
     📊 Enviar sua glicemia (ex: 120)
     🍽️ Enviar foto da sua refeição para análise
     📈 Digitar "histórico" para ver os últimos 7 dias
     💊 Digitar "perfil" para ver suas informações'

  Resposta imediata ao registro:
    'Glicemia de [valor] mg/dL registrada! 📊
     Analisando e em breve envio sua orientação... 🧠'

FRONTEND — Tela de Mensagens:
  Sidebar 280px: lista pacientes + preview + badge não lidos
  Área chat: balões PT-BR estilo WhatsApp
    Paciente (direita): bg #E8F0FD
    IA/Sistema (esquerda): bg #F5F7FA + badge 'IA'
    Profissional (esquerda): bg #E8F8EF + badge 'Dr. [Nome]'
  Rodapé: input 'Digite uma mensagem...' + botão 'Enviar'
  Timestamps relativos: 'agora', 'há 5 min', '14:32'


FASE 6  ·  IA — GPT-5.1 + VISION API
⏱  3 semanas
🟢 Concluído


📋 Tarefas
🟢  🤖  Worker analisarGlicemia com GPT-5.1
🟢  🍽️  Worker analisarRefeicao com Vision API
🟢  📤  Integrar resultado dos workers com WhatsApp
🟢  ⚠️  Alertas críticos automáticos para profissional
🟢  🧠  PainelIALateral no dashboard: resumo diário
🟢  📱  CardAnaliseIA na tela de refeições mobile
🟢  🔒  Rate limit: 20 análises/paciente/dia

🤖  PROMPT IDE — FASE 6 — IA WORKERS (GPT-5.1 + VISION)
workers/ia-worker/src:

analisarGlicemia.worker.ts:
  1. Busca histórico 15 registros + perfil paciente
  2. GPT-5.1 — system prompt:
     'Você é um assistente de saúde para pacientes com diabetes.
      Responda em Português BR, linguagem simples e encorajadora.
      Nunca use jargão médico. Máximo 3 parágrafos curtos.
      Se glicemia crítica (>300 ou <60): seja gentil mas urgente.'
  3. Salva analiseIA no registro + envia via WhatsApp
  4. Se crítica: notifica profissional com alerta

analisarRefeicao.worker.ts:
  1. Baixa imagem → base64
  2. Vision API → JSON: { alimentos, calorias, carboidratos, ig, cg }
  3. GPT-5.1 gera resposta PT-BR:
     '🍽️ Identifiquei na sua refeição: [alimentos]
      📊 Estimativa: [calorias] kcal | [carbs]g carboidratos
      🧠 Sua glicemia pode subir ~[X]-[Y] mg/dL.
      💡 [orientação personalizada e encorajadora]'

Rate limit: INCR Redis 'ia_diaria:{pacienteId}:{data}'
  Se > 20: 'Limite diário atingido. Tente amanhã! 😊'

FRONTEND — PainelIALateral (desktop, 320px):
  Cabeçalho: '🤖 Resumo do Dia'
  Texto gerado pelo GPT-5.1 1x/dia
  Cards de alertas ativos com badge colorido
  Botão 'Ver todos os alertas'

FRONTEND — CardAnaliseIA (mobile, tela refeições):
  Thumbnail da foto + lista de alimentos identificados
  Macros em linha: Kcal / Carbs / IG / CG
  Mensagem da IA em balão com ícone robô
  BadgeIndiceGlicemico: Baixo/Médio/Alto


FASE 7  ·  FINANCEIRO — STRIPE (standby não inciar sem autorização, tomando decisaão sobre outro gateway)
⏱  2 semanas
🔴 Em andamento (standby não inciar sem autorização, tomando decisaão sobre outro gateway)


📋 Tarefas
🔴  💳  Criar produtos e preços no Stripe
🔴  🔗  POST /financeiro/checkout → Stripe Session
🔴  📩  Webhook Stripe com validação de assinatura
🔴  📊  Controle de acesso por plano de assinatura
🔴  💰  Tela Financeiro com histórico de pagamentos
🔴  ⚠️  E-mail automático de inadimplência

🤖  PROMPT IDE — FASE 7 — STRIPE + ASSINATURAS
BACKEND (src/modulos/financeiro):
  POST /financeiro/checkout → Stripe Checkout Session
  POST /financeiro/webhook  → valida + processa eventos:
    invoice.payment_succeeded → Assinatura ATIVA + Pagamento PAGO
    invoice.payment_failed    → Assinatura INADIMPLENTE + e-mail
    customer.subscription.deleted → Assinatura CANCELADA + downgrade
  GET  /financeiro/assinatura  → status atual
  GET  /financeiro/pagamentos  → histórico paginado
  POST /financeiro/cancelar    → cancelarNoFim = true
  POST /financeiro/portal      → Stripe Customer Portal

Planos sugeridos (criar no Stripe):
  Inicial:      Até 50 pacientes — R$ 297/mês
  Profissional: Até 200 pacientes — R$ 697/mês
  Clínica:      Até 1000 pacientes — R$ 1.497/mês

FRONTEND (src/paginas/Financeiro):
  CardAssinatura: plano + status badge + próxima cobrança
    status ATIVO: badge verde; INADIMPLENTE: badge vermelho
  TabelaPagamentos: data | valor | status | link fatura
  Botão 'Gerenciar Plano' → Stripe Customer Portal
  BannerAlerta vermelho se inadimplente ou cancelado
  Todos os textos de planos e status em Português BR


FASE 8  ·  MENSAGENS + HEATMAP + RELATÓRIOS
⏱  2 semanas
� Concluído


📋 Tarefas
🟢  💬  Tela de chat completa com histórico por paciente
🟢  ✉️  Envio manual de mensagem pelo profissional
🟢  🗓️  Heatmap de adesão mensal (estilo GitHub)
🟢  📄  Geração de relatório PDF em PT-BR
🟢  🔔  Notificações in-app com SinoBell e dropdown
🟢  📱  Revisão responsiva completa mobile (375px)

🤖  PROMPT IDE — FASE 8 — MENSAGENS, HEATMAP E RELATÓRIOS
BACKEND:
  GET  /pacientes/:id/mensagens?pagina=&limite=
  POST /pacientes/:id/mensagens → salva + envia via WhatsApp
  GET  /pacientes/:id/heatmap?meses=3 → contagem de registros por dia
  GET  /pacientes/:id/relatorio?de=&ate= → gera PDF

FRONTEND — Heatmap de Adesão:
  Grid de células 12x12px por dia (estilo GitHub contributions)
  0 registros: #E0E6ED | 1: #B3D9B3 | 2-3: #27AE60 | 4+: #1A7A42
  Tooltip: '[data]: [N] registros, média [valor] mg/dL'
  Legenda: 'Menos' → 'Mais' com gradiente verde

FRONTEND — Relatório PDF:
  Cabeçalho: logo 'GLUCO IA' com cores da marca
  Seções: Dados do Paciente | Estatísticas | Gráfico | Tabela
  Todos os textos em Português BR
  Footer com nome da clínica e data de geração

FRONTEND — SistemaNotificacoes:
  SinoBell no cabeçalho: badge vermelho pulsante
  Dropdown: lista com avatar + 'glicemia crítica: 310 mg/dL' + timestamp
  ToastNotificacao: canto inferior direito, 4 variantes, 5s auto-dismiss
  AlertaBanner fixo no topo se há glicemia crítica não respondida


FASE 9  ·  DEPLOY + CI/CD + LANÇAMENTO
OBSERVAÇÃO: PREPARAR TUDO DE FORMA PARA DEPLOY NO EASYPANEL.
⏱  4 semanas +
🟡 Em andamento


📋 Tarefas
🟢  🐳  Dockerfiles de produção para todos os serviços
🟢  🌐  Nginx com SSL automático (Let's Encrypt)
🟢  🔄  GitHub Actions: lint → type-check → build → deploy. Enviar para o repo: https://github.com/glucoai/glucoai proprietário: glucoai | aqsmdp.projects@gmail.com ✅ enviado
🟢  🧪  Testes: unitários (Vitest) + e2e (Playwright)
🔴  📊  Sentry para rastreamento de erros
🔴  🔒  Audit de segurança: OWASP checklist
🔴  🚀  Deploy e testes de carga

🤖  PROMPT IDE — FASE 9 — DOCKER PRODUÇÃO + CI/CD
Dockerfiles de produção (multi-stage):
  apps/backend/Dockerfile: builder(node:20-alpine) → runner
  apps/frontend/Dockerfile: builder → nginx:alpine com dist
  workers/ia-worker/Dockerfile: builder → runner

docker-compose.prod.yml:
  - Variáveis via .env (nunca hardcoded)
  - PostgreSQL com backup diário agendado
  - Redis com persistência AOF
  - restart: unless-stopped em todos
  - healthchecks em todos os serviços

. PROCESSOS ADICIONAIS

📋 Tarefas
🟢  🧾  Página de venda pública como home, com planos mockados e CNPJ no rodapé

infra/nginx/nginx.conf:
  /api/* → proxy backend:3000
  /*     → proxy frontend:80
  SSL: certbot + Let's Encrypt automático
  gzip: text/css, application/javascript, application/json

.github/workflows/deploy.yml:
  on: push to main
  jobs: lint → type-check → test → build → deploy (SSH)

Monitoramento:
  - Sentry em frontend + backend
  - UptimeRobot para health checks externos
  - Alertas se backend retornar 5xx por 2+ min


✅ Checklist Final Pré-Lançamento
   •   Design System Gluco IA aplicado em 100% das telas
   •   Zero texto em inglês na interface do usuário
   •   GaugeGlicemia com animação e cores corretas por status
   •   BarraNavegacaoInferior mobile funcionando em iOS e Android
   •   Saudação personalizada 'Bom dia, [Nome]!' no painel
   •   Heatmap de adesão renderizando corretamente
   •   Chat WhatsApp-style com balões coloridos por remetente
   •   Análise de IA em PT-BR respondida em < 30 segundos
   •   Stripe checkout e webhook funcionando em produção
   •   CI/CD passando: lint + type-check + testes + deploy
   •   HTTPS ativo com certificado válido
   •   Responsivo: testado em 375px, 768px e 1440px


PAINEL DE PROGRESSO — ACOMPANHAMENTO
Atualizado pelo agente a cada tarefa concluída. Reflete o estado real do projeto.

Fase
Descrição
Responsável
Prazo
Status
F1 - Setup
Monorepo + Vite + Fastify + Design System
_______
Sem 1-2
🟢 Concluído
F2 - Infra
Docker + PostgreSQL + Redis + Prisma
_______
Sem 2-3
🟢 Concluído
F3 - Auth
Login + JWT + Layout Desktop e Mobile
_______
Sem 3-5
🟢 Concluído
F4 - Core
Pacientes + Glicemia + Painel
_______
Sem 5-8
🟡 Em andamento
F5 - WA
WhatsApp + Menu PT-BR + Chat
_______
Sem 8-10
🟢 Concluído
🔴 Pendente
F6 - IA
GPT-4o + Vision + Workers + Painel IA
_______
Sem 10-13
🔴 Pendente
F7 - Fin
Stripe + Assinaturas + Tela Financeiro
_______
Sem 13-15
🔴 Pendente
F8 - Msg
Chat + Heatmap + Relatórios + Notif.
_______
Sem 15-17
� Concluído
F9 - Deploy
Docker Prod + CI/CD + Lançamento
_______
Sem 17-22
🔴 Pendente


🎯 Definição de Pronto — Critério universal entre fases
   •   Código passa no ESLint sem warnings e TypeScript strict sem erros
   •   Feature funciona no ambiente de desenvolvimento (docker compose up)
   •   Todos os textos e labels estão em Português BR
   •   Design System Gluco IA aplicado: apenas tokens de cor definidos no PRD
   •   Endpoints com Zod validation e erros claros em PT-BR
   •   Roadmap atualizado pelo agente com o novo status (🔴→🟡→🟢)


