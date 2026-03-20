
GLUCO
IA


Tecnologia cuidando da sua glicemia.
PRD SUPREMO v2 — UI/UX + IDENTIDADE VISUAL + PROMPTS IDE

Campo
Informação
Produto
Gluco IA — AI Metabolic Assistant
Versão
2.0 — UI/UX Suprema + Mobile-first
Stack
React + Vite + Node + Fastify + PostgreSQL + OpenAI
Design
Inter/Poppins · Midnight Void #08090F · Intelligence Blue #2B7FFF · Optimal Teal #00D9B4
Idioma
Português BR — toda a interface, labels e mensagens
Referências UI
App Nutrição · Dashboard SaaS · App Médico · DocuVeria
Status
🟡 Em desenvolvimento ativo


01 · IDENTIDADE VISUAL & DESIGN SYSTEM
Aplicar desde o primeiro commit. Toda decisão de interface segue este guia.

🎨 Paleta de Cores Oficial — Midnight Void
Token CSS
HEX + Uso
--cor-fundo
#08090F — Midnight Void: background principal (40%)
--cor-primaria
#2B7FFF — Intelligence Blue: CTA, links, ação primária (15%)
--cor-sucesso
#00D9B4 — Optimal Teal: estado ótimo, sucesso
--cor-superficie
#1C2235 — Deep Carbon: cards e surfaces
--cor-fundo-claro
#EEF2FF — Arctic Mist: background light mode
--cor-otimo
#00C896 — Optimal: acento positivo
--cor-atencao
#F5A623 — Warning
--cor-perigo
#FF4D4D — Alert
--cor-info
#7C9EFF — Info
--cor-texto
#EEF2FF — Texto principal no modo escuro
--cor-primaria-escura
#2B7FFF — Hover de botões e elementos primários
--cor-borda
#1C2235 — Bordas e divisores em superfícies escuras

🖼️ Logos e Ícones
Uso
Arquivo
Logo para fundo escuro
/logo-gluco-ai-para-fundo-escuro.png
Logo para fundo claro
/logo-gluco-ai-para-fundo-claro.png
Favicon
/icone-gluco-ai-favicon.png


🔤 Tipografia
Uso
Fonte + Pesos
Interface, dados, labels
Inter — 400 Regular, 500 Médio, 600 Semi-Bold, 700 Bold
Títulos, logo, marketing
Poppins — 600 Semi-Bold, 700 Bold
Valores numéricos de glicemia
Inter + font-variant-numeric: tabular-nums
Código / Snippets
JetBrains Mono ou Fira Code


📐 Tokens de Espaçamento e Forma
Token
Valor + Uso
--raio-sm
6px — badges, chips, tags
--raio-md
12px — cards, modais, inputs
--raio-lg
20px — bottom sheets, cards grandes
--raio-xl
28px — cards hero mobile
--sombra-card
0 2px 16px rgba(43,127,255,0.08) — cards padrão
--sombra-hover
0 8px 32px rgba(43,127,255,0.16) — hover e active
--sombra-modal
0 24px 64px rgba(0,0,0,0.12) — modais e bottom sheets


⚙️ Variáveis CSS — globals.css
🤖  PROMPT PARA IDE — SETUP DESIGN SYSTEM — globals.css
:root {
  /* CORES */
  --cor-primaria:        #2B7FFF;
  --cor-primaria-escura: #2B7FFF;
  --cor-sucesso:         #00D9B4;
  --cor-otimo:           #00C896;
  --cor-atencao:         #F5A623;
  --cor-perigo:          #FF4D4D;
  --cor-info:            #7C9EFF;
  --cor-texto:           #EEF2FF;
  --cor-fundo:           #08090F;
  --cor-fundo-claro:     #EEF2FF;
  --cor-superficie:      #1C2235;
  --cor-borda:           #1C2235;

  /* TIPOGRAFIA */
  --fonte-principal: 'Inter', system-ui, sans-serif;
  --fonte-display:   'Poppins', sans-serif;
  --fonte-mono:      'JetBrains Mono', monospace;

  /* FORMA */
  --raio-sm: 6px;   --raio-md: 12px;
  --raio-lg: 20px;  --raio-xl: 28px;

  /* SOMBRAS */
  --sombra-card:  0 2px 16px rgba(43,127,255,0.08);
  --sombra-hover: 0 8px 32px rgba(43,127,255,0.16);
  --sombra-modal: 0 24px 64px rgba(0,0,0,0.12);
}

body {
  font-family: var(--fonte-principal);
  color: var(--cor-texto);
  background: var(--cor-fundo);
  -webkit-font-smoothing: antialiased;
}


02 · SISTEMA DE COMPONENTES — PT-BR
Todos os componentes do Design System Gluco IA são documentados aqui com especificação visual completa. Labels, placeholders e textos sempre em Português BR.

🔘 Botões
Elemento
Especificação
Token de Cor
Comportamento
BotaoPrimario
bg #2B7FFF, texto branco, raio 10px, padding 12px 24px
--cor-primaria
Hover: #2B7FFF; Loading: spinner branco centralizado
BotaoSecundario
border 1.5px #2B7FFF, texto #2B7FFF, bg transparente
--cor-primaria
Hover: bg #2B7FFF
BotaoPerigo
bg #FF4D4D, texto branco
--cor-perigo
Confirmar exclusão com modal
BotaoGhost
sem border, texto #EEF2FF
--cor-texto
Hover: bg #1C2235
BotaoIcone
40x40px circular, ícone 20px
--cor-superficie
Tooltip ao hover


📊 Indicador de Glicemia (componente-chave)
GaugeGlicemia — Gauge Circular (inspiração: app nutrição ref. 1)
   •   Gauge circular SVG de 200px — valor central em bold Inter 32px
   •   Anel colorido por status: verde (70-140) / laranja (141-200) / vermelho (<70 ou >200)
   •   Label abaixo: 'Em jejum', 'Após refeição', etc. em cinza 14px
   •   Animação: stroke-dashoffset transition 0.8s ease ao carregar
   •   Versão compacta (80px) para uso em cards de lista de pacientes


🃏 Cards
Elemento
Especificação
Token de Cor
Comportamento
CardKPI
bg #1C2235, raio 12px, sombra-card, padding 20px
--cor-superficie
Hover: sombra-hover; sparkline Recharts embutido no rodapé
CardPaciente
avatar 40px + nome bold + badge tipo diabetes
--cor-borda
Gauge compacto de glicemia no canto direito
CardRefeicao
thumbnail 72x72px à esquerda + macros em linha
--cor-superficie
Tag de índice glicêmico colorida
CardAlerta
border-left 4px #FF4D4D + ícone pulsante
--cor-perigo
Botão 'Contatar' em linha
CardAISaude
gradiente sutil #2B7FFF→#1C2235 + ícone robô
--cor-primaria
Texto gerado pela IA em itálico


🏷️ Badges e Chips
Componente
Especificação
BadgeTipoDiabetes
Tipo 1 (azul) | Tipo 2 (verde) | Gestacional (laranja) | Pré (roxo)
BadgeStatusGlicemia
Normal (verde) | Elevada (laranja) | Crítica (vermelho pulsante)
BadgeAssinatura
Ativo (verde) | Inadimplente (vermelho) | Trial (azul) | Cancelado (cinza)
ChipFiltro
bg #1C2235, border #1C2235 — ativo: bg #2B7FFF, texto branco
TagRefeicao
Café da Manhã / Almoço / Jantar / Lanche — cor única por categoria


📋 Inputs e Formulários
Componente
Especificação PT-BR
CampoTexto
Placeholder em cinza #7C9EFF; label acima flutuante; border #1C2235
CampoGlicemia
Input numérico grande (font 24px); unidade 'mg/dL' à direita em cinza
SeletorContexto
Dropdown: 'Em Jejum' / 'Após Café' / 'Após Almoço' / 'Após Jantar' / 'Ao Dormir'
SeletorPeriodo
Chips: '7 dias' / '30 dias' / '90 dias' / 'Personalizado'
BuscaPaciente
Ícone lupa + placeholder 'Buscar paciente...' + debounce 300ms


🔔 Notificações e Alertas
SistemaAlertas — especificação completa
   •   SinoBell no header: badge vermelho pulsante com contador de não lidos
   •   Dropdown: lista de alertas com avatar do paciente + valor crítico + timestamp relativo
   •   ToastNotificacao: canto inferior direito, 4 variantes (sucesso/atenção/erro/info), auto-dismiss 5s
   •   AlertaBanner: faixa no topo da página — reservado apenas para glicemia crítica ativa
   •   ModalConfirmacao: sempre em PT-BR com título claro + descrição da consequência


03 · TELAS MOBILE — PACIENTE (App-like Web)
O paciente acessa via PWA ou link no WhatsApp. A experiência deve parecer um app nativo. Referências: app nutrição (imagem 1) e app médico CUF (imagem 3).

📱 Layout Base Mobile
Estrutura de Navegação Mobile
   •   BarraNavegacaoInferior: 5 ícones — Início / Glicemia / Refeições / Histórico / Perfil
   •   Altura: 64px; bg #1C2235; ícone ativo em azul #2B7FFF com label; inativos em #7C9EFF
   •   Tela cheia sem padding lateral excessivo — conteúdo respira até as bordas (16px padding)
   •   SafeArea: respeitar notch e barra de gestos em iOS/Android
   •   Transições entre telas: slide horizontal suave (200ms ease-out)


🏠 Tela Inicial — Paciente
Elemento
Especificação
Token de Cor
Comportamento
Cabeçalho
'Bom dia, [Nome]!' em Poppins 22px bold
--cor-texto
Data atual em cinza 14px abaixo
GaugeGlicemia
Gauge circular 200px centralizado
Status atual
Último registro + horário relativo
CardResumoDia
Proteína / Carboidratos / Calorias em 3 colunas
--cor-superficie
Barra de progresso colorida por meta
ListaRefeicoes
Thumbnail 72px + nome + horário + badge IG
--cor-borda
Swipe para excluir
BotaoRegistrar
FAB azul 56px + ícone '+' fixo no canto inferior direito
--cor-primaria
Abre bottom sheet de registro


📊 Tela de Glicemia — Paciente
Elemento
Especificação
Token de Cor
Comportamento
GaugeGrande
220px centralizado, valor em 36px bold
Status
Classificação textual abaixo
SeletorContexto
Chips horizontais scrolláveis
--cor-borda
Em Jejum / Após Café / Após Almoço...
GraficoLinha
LineChart altura 180px, 7 dias
--cor-primaria
Faixa verde 70-140 como área de referência
EstatisticasRow
Média / Mínimo / Máximo em 3 colunas
--cor-superficie
Ícone colorido por status em cada card
HistoricoLista
Data + valor + badge status + contexto
--cor-borda
Infinit scroll com paginação


🍽️ Tela de Refeições — Paciente
Elemento
Especificação
Token de Cor
Comportamento
BotaoEnviarFoto
Área de drag-drop grande + ícone câmera
--cor-primaria
Ao tocar: abre câmera nativa
CardAnaliseIA
Thumbnail + lista alimentos + macros
--cor-superficie
Estimativa glicêmica em destaque
BadgeIndiceGlicemico
IG Baixo (verde) / Médio (laranja) / Alto (vermelho)
Status
Tooltip com explicação
MensagemIA
Balão de chat com ícone robô
--cor-azulFill
Texto encorajador em PT-BR
HistoricoRefeicoes
Grid 2 colunas com thumbnails
--cor-borda
Tap para ver análise completa


👤 Tela de Perfil — Paciente
Elemento
Especificação
Token de Cor
Comportamento
AvatarHero
Avatar 96px circular + nome Poppins 20px bold
--cor-primaria
Gradiente sutil no fundo do cabeçalho
CardDadosClinicos
Tipo diabetes + tempo diagnóstico + meta glicêmica
--cor-superficie
Ícones coloridos por campo
CalendarioAdesao
Heatmap mensal de registros — verde escuro = mais registros
--cor-sucesso
Inspiração: GitHub contributions
ConfiguracoesList
Notificações / Unidade (mg/dL) / Tema / Sair
--cor-borda
Ícone + label + chevron


04 · DASHBOARD CLÍNICO — MÉDICO/ADMIN (Desktop)
Inspiração: Dashboard Lessa (imagem 2) e DocuVeria (imagem 4). Sidebar colapsável, KPIs com sparkline, saudação personalizada e painel de IA fixo.

🖥️ Layout Base Desktop
Estrutura do Dashboard Clínico
   •   SidebarNavegacao: 240px expandida / 64px colapsada (ícones apenas) — bg #1C2235
   •   Cabeçalho fixo: 64px, bg #1C2235, sombra suave — 'Bom dia, Dr. [Nome]! ☀️' em Poppins
   •   Toggle de tema (escuro/claro) ao lado do sino de alertas
   •   AreaConteudo: bg #08090F, padding 24px, scroll interno — nunca a página inteira
   •   PainelIALateral: 320px fixo à direita (colapsável) — resumo IA + alertas ativos
   •   Responsividade: colapsa sidebar em < 1024px; remove painel IA em < 1280px


📊 Dashboard Principal
Elemento
Especificação
Token de Cor
Comportamento
KPIsGrid
4 cards em linha — Pacientes / Alertas / MRR / Adesão
--cor-superficie
Sparkline Recharts 7d embutido no rodapé de cada card
GraficoGlicemiaDiaria
LineChart 30 dias, área preenchida azul
--cor-primaria
Tooltip rico: data + média + quantidade
GraficoDistribuicao
PieChart tipos de diabetes — 4 fatias coloridas
Paleta do DS
Legenda à direita com percentuais
TabelaAlertas
Avatar + nome + última glicemia + valor + status + ação
--cor-perigo
Linha pulsante em vermelho se crítico
ResumoIA
Card gradiente com ícone robô — resumo do dia gerado por GPT
--cor-azulFill
Atualiza 1x/dia às 8h automaticamente


📋 Página de Pacientes
Elemento
Especificação
Token de Cor
Comportamento
BarraBusca
Input 'Buscar paciente...' 400px + filtros por chips
--cor-borda
Debounce 300ms + destaque do termo buscado
ChipsFiltro
Todos / Tipo 1 / Tipo 2 / Gestacional / Atenção Necessária
--cor-primaria ativo
Contador por categoria entre parênteses
TabelaPacientes
Avatar + nome + telefone + tipo + última glicemia + status
--cor-superficie
Linha hover: bg #1C2235
GlicemiaInline
Gauge compacto 40px na coluna da tabela
Status
Verde/laranja/vermelho por valor
SparklineMini
Gráfico 80x32px últimos 7 dias por linha
--cor-primaria
Tooltip com valor ao hover


👤 Perfil Detalhado do Paciente
Elemento
Especificação
Token de Cor
Comportamento
HeroPaciente
Avatar 72px + nome Poppins 24px + badges clínicos
--cor-primaria
Gradiente sutil no cabeçalho
GraficoGlicemiaCompleto
LineChart com seletor 7d/30d/90d/Personalizado
--cor-primaria
Área de referência verde 70-140
CardsEstatistica
Média / DP / % no Alvo / GMI — 4 cards
Status por valor
Comparativo vs. período anterior
CalendarioHeatmap
Heatmap mensal de registros (estilo GitHub)
--cor-sucesso
Tooltip: data + quantidade + média
TabHistorico
Glicemias / Refeições / Mensagens — abas
--cor-borda
Paginação infinita em cada aba
PainelIA
Últimas análises da IA com ícone robô
--cor-azulFill
Accordion para expandir cada análise


💬 Tela de Mensagens
Elemento
Especificação
Token de Cor
Comportamento
ListaPacientes
Sidebar 280px — nome + preview msg + horário
--cor-superficie
Badge contador mensagens não lidas
AreaChat
Balões estilo WhatsApp — paciente (direita, azul) / IA (esquerda, cinza)
--cor-azulFill
Timestamp relativo em cada mensagem
MensagemProfissional
Balão esquerda verde suave — badge 'Dr. [Nome]'
--cor-verdeFill
Enviado via WhatsApp automaticamente
InputMensagem
Campo fixo no rodapé + botão enviar azul
--cor-primaria
Enter para enviar; Shift+Enter nova linha


05 · VISÃO DO PRODUTO
O Gluco IA é uma plataforma SaaS clínica que usa inteligência artificial para monitorar, analisar e orientar pacientes com diabetes de forma escalável, automatizada e humanizada.

🎯 Objetivos Estratégicos
Dimensão
Objetivo
Métrica de Sucesso
🏥 Clínico
Ajudar pacientes a controlar a glicemia contínua e personalizadamente
Redução de 15% na HbA1c em 90 dias
⚙️ Operacional
1 médico acompanha 500+ pacientes com automação via IA
< 5 min/paciente/mês de esforço manual
💰 Negócio
SaaS escalável com receita recorrente para clínicas
MRR crescendo 20%/mês pós-lançamento


👥 Personas
1️⃣  Administrador da Clínica
   •   Acesso total: pacientes, financeiro, estatísticas, automações
   •   Dashboard executivo com KPIs de negócio e clínicos
   •   Gestão de profissionais e permissões de acesso


2️⃣  Profissional de Saúde
   •   Acompanha evolução glicêmica e alimentar dos seus pacientes
   •   Recebe alertas de glicemia crítica em tempo real
   •   Envia mensagens personalizadas via dashboard


3️⃣  Paciente
   •   Interage via WhatsApp — zero instalação, zero fricção
   •   Envia glicemia e fotos de refeições; recebe orientações da IA
   •   Dashboard móvel simplificado para consultar histórico


06 · ARQUITETURA DO SISTEMA
Monorepo pnpm com separação clara de responsabilidades, preparado para escalar de 100 a 100.000 pacientes.

🏗️ Stack Tecnológica
Camada
Tecnologia + Justificativa
Frontend
React 18 + Vite + TypeScript + Tailwind + React Query + Zustand + Recharts
Backend
Node.js 20 + Fastify + TypeScript + Prisma ORM + Zod + JWT + Argon2
Banco de Dados
PostgreSQL 16 (ACID) + Redis 7 (cache e filas)
IA
OpenAI GPT-4o (análise glicêmica) + Vision API (fotos de refeição) + BullMQ workers
Integrações
WhatsApp Business API (Meta) + Stripe / Mercado Pago
Infra
Docker + Nginx + GitHub Actions CI/CD


🤖  PROMPT PARA IDE — SETUP MONOREPO — FASE 1
Crie um monorepo pnpm para o projeto Gluco IA:

gluco-ia/
  apps/
    frontend/   → React 18 + Vite + TypeScript + Tailwind
    backend/    → Node 20 + Fastify + TypeScript
  packages/
    ui/         → Design System Gluco IA (componentes PT-BR)
    tipos/      → Types TypeScript compartilhados
    utils/      → Helpers: formatarData, formatarMoeda, classificarGlicemia
  workers/
    ia-worker/  → BullMQ + OpenAI
  infra/
    docker/     → Dockerfiles
    nginx/      → Proxy reverso

Configurar: pnpm workspaces, tsconfig.base.json, ESLint + Prettier
Fontes: Inter + Poppins via Google Fonts no index.html
Tokens CSS do Design System já configurados em globals.css
Todos os textos de UI, labels e placeholders em Português BR


07 · MÓDULOS DO SISTEMA

🔐 Autenticação
Funcionalidades
   •   Login com e-mail e senha — JWT 15min + Refresh Token 7 dias (Redis)
   •   Controle de perfis: administrador | profissional | paciente
   •   Middleware de autenticação em todas as rotas protegidas
   •   Limite de tentativas: 10 por IP em 15min (Redis)
   •   Hash de senhas com Argon2


🤖  PROMPT PARA IDE — MÓDULO AUTENTICAÇÃO
Implemente autenticação no backend Fastify + frontend React:

BACKEND:
  POST /autenticacao/entrar  → JWT + refreshToken
  POST /autenticacao/renovar → novo JWT via refreshToken
  POST /autenticacao/sair    → invalida refreshToken no Redis
  Middleware: autenticarJWT() e exigirPerfil('administrador'|'profissional')

FRONTEND — Tela de Login:
  Layout: fundo #08090F, card centralizado max-w-md bg #1C2235, raio 20px
  Logo: 'GLUCO' (azul #2B7FFF) + 'IA' (verde #00D9B4), Poppins 700
  Subtítulo: 'Tecnologia cuidando da sua glicemia.'
  Campos: E-mail / Senha com labels em português
  Botão: 'Entrar' — primário azul com loading spinner
  Erro: alert vermelho com mensagem clara em PT-BR


👥 Pacientes
Funcionalidades
   •   CRUD completo com validação Zod
   •   Dados: nome, telefone, data de nascimento, gênero, cidade
   •   Dados clínicos: tipo de diabetes, tempo de diagnóstico, medicamentos, metas glicêmicas
   •   Listagem com busca, filtros e paginação server-side
   •   Soft delete (desativar sem excluir histórico)


🤖  PROMPT PARA IDE — MÓDULO PACIENTES
Implemente o módulo de pacientes com UI conforme o Design System Gluco IA:

BACKEND:
  GET  /pacientes?busca=&tipo=&pagina=&limite=
  GET  /pacientes/:id  → inclui última glicemia + última refeição
  POST /pacientes      → validação Zod completa
  PUT  /pacientes/:id  → atualização parcial
  DEL  /pacientes/:id  → soft delete (ativo = false)

FRONTEND — Listagem:
  Chips de filtro: 'Todos' / 'Tipo 1' / 'Tipo 2' / 'Gestacional' / 'Atenção'
  TabelaPacientes com colunas: Avatar | Nome | Telefone | Tipo | Glicemia | Status
  Gauge compacto 40px na coluna Glicemia (verde/laranja/vermelho)
  Sparkline 7 dias embutido na linha da tabela
  Hover da linha: bg #1C2235; cursor pointer → abre perfil

FRONTEND — Perfil do Paciente:
  Cabeçalho herói: avatar 72px + nome Poppins 24px + badges clínicos
  Abas: Glicemia | Refeições | Mensagens | Histórico
  LineChart com seletor de período (chips: 7d / 30d / 90d)
  Heatmap de adesão (estilo GitHub contributions)


📊 Glicemia
Funcionalidades
   •   Registro via WhatsApp ou dashboard — classificação automática
   •   Faixas: Hipoglicemia (<70) / Normal (70-140) / Elevada (141-200) / Crítica (>300)
   •   Alerta automático ao profissional para glicemias críticas
   •   Estatísticas: média, desvio padrão, % tempo no alvo, GMI
   •   Gráfico de linha com área de referência 70-140 em verde


🤖  PROMPT PARA IDE — MÓDULO GLICEMIA
Implemente o módulo de registros glicêmicos:

BACKEND:
  GET  /pacientes/:id/glicemias?de=&ate=
  GET  /pacientes/:id/glicemias/estatisticas
  POST /pacientes/:id/glicemias

  utils/classificarGlicemia.ts:
    < 70     → 'HIPO'   — cor: #FF4D4D — label: 'Hipoglicemia'
    70–140   → 'NORMAL' — cor: #00D9B4 — label: 'Normal'
    141–200  → 'ELEVADA'— cor: #F5A623 — label: 'Elevada'
    > 200    → 'HIPER'  — cor: #FF4D4D — label: 'Hiperglicemia'
    > 300    → 'CRITICA'— cor: #FF4D4D — label: 'Crítica' + alerta

FRONTEND — GaugeGlicemia (componente central):
  SVG circular 200px — anel colorido por status
  Valor central: Inter 36px bold — cor do status
  Contexto abaixo: 'Em Jejum', 'Após Almoço', etc.
  Animação de entrada: stroke-dashoffset 0.8s ease

FRONTEND — Gráfico:
  LineChart Recharts — cor da linha: #2B7FFF
  Área de referência: ReferenceArea y1=70 y2=140 fill='#00D9B4' fillOpacity=0.1
  Pontos coloridos: dot customizado por status
  Tooltip com: data/hora + valor + classificação + contexto


🤖 Inteligência Artificial
Funcionalidades
   •   Workers assíncronos BullMQ — análise nunca bloqueia o request
   •   GPT-4o analisa padrão glicêmico com contexto do paciente
   •   Vision API identifica alimentos em fotos e estima impacto glicêmico
   •   Tom sempre encorajador, linguagem simples, Português BR
   •   Rate limit: 20 análises por paciente por dia
   •   Fallback: mensagem padrão se OpenAI indisponível


🤖  PROMPT PARA IDE — MÓDULO IA — WORKERS
Implemente workers de IA com BullMQ:

workers/ia-worker/src:
  analisarGlicemia.worker.ts:
    1. Busca histórico 15 registros + perfil do paciente
    2. GPT-4o — system: 'Assistente de saúde especializado em diabetes.
       Responda em Português BR, linguagem simples e encorajadora.
       Máximo 3 parágrafos curtos. Nunca use jargão médico.'
    3. Salva análise + envia via WhatsApp
    4. Se crítica: notifica profissional

  analisarRefeicao.worker.ts:
    1. Vision API → identifica alimentos, estima calorias, IG e CG
    2. GPT-4o → gera orientação glicêmica em PT-BR
    3. Resposta: '🍽️ Identifiquei: [alimentos]
       📊 Estimativa: [calorias] kcal | [carbs]g carboidratos
       🧠 Sua glicemia pode subir ~[X]-[Y] mg/dL.
       💡 [orientação personalizada e encorajadora]'


12 · SEO AVANÇADO — PÚBLICO
Aplicar apenas nas rotas públicas: /, /venda, /entrar.

Meta tags por rota
- Title, description e canonical em PT-BR
- Open Graph e Twitter Card com imagem oficial
- Robots index, follow nas rotas públicas

Arquivos estáticos
- robots.txt com sitemap e regras de produção
- sitemap.xml com URLs públicas

Schema.org
- Organization e WebSite via JSON-LD

Configuração: concorrência 5 (glicemia) e 3 (refeição)
Retry: 3 tentativas com backoff exponencial


💬 WhatsApp
🤖  PROMPT PARA IDE — MÓDULO WHATSAPP
Integre a WhatsApp Business API:

BACKEND:
  GET  /whatsapp/webhook → verificação Meta
  POST /whatsapp/webhook → recebe mensagens

  RoteadorMensagens:
    Número (ex: '120') → registra glicemia → publica job
    Imagem/foto        → registra refeição → publica job
    'oi'/'olá'/'menu'  → envia menu em PT-BR
    'histórico'        → resumo 7 dias

  Menu PT-BR:
    'Olá! Sou o assistente Gluco IA 🤖
     Você pode:
     📊 Enviar sua glicemia (ex: 120)
     🍽️ Enviar foto da sua refeição
     📈 Digitar "histórico" para ver os últimos 7 dias'

Salvar todas mensagens em tabela mensagens com: remetente, tipo, conteúdo


08 · BANCO DE DADOS — SCHEMA
🤖  PROMPT PARA IDE — SCHEMA PRISMA COMPLETO
model Clinica { id, nome, slug, plano, logotipo, criadoEm
  usuarios Usuario[], pacientes Paciente[] }

model Usuario { id, clinicaId, nome, email, senhaHash
  perfil: enum Perfil { ADMINISTRADOR PROFISSIONAL }
  criadoEm, ativo }

model Paciente { id, clinicaId, nome, telefone (único por clínica)
  dataNascimento, genero, cidade, pais
  tipoDiabetes: enum TipoDiabetes { TIPO_1 TIPO_2 GESTACIONAL PRE }
  anosdiagnostico, medicamentos, metaGlicemicaMin, metaGlicemicaMax
  ativo, criadoEm
  glicemias Glicemia[], refeicoes Refeicao[], mensagens Mensagem[] }

model Glicemia { id, pacienteId, valor (Float), unidade (MG_DL|MMOL_L)
  contexto (JEJUM|APOS_CAFE|APOS_ALMOCO|APOS_JANTA|DORMIR|OUTRO)
  origem (WHATSAPP|DASHBOARD|API), notas, analiseIA, registradoEm }
  @@index([pacienteId, registradoEm])

model Refeicao { id, pacienteId, urlImagem, analise (Json)
  alimentos (String[]), calorias, carboidratos
  indiceGlicemico, cargaGlicemica, recomendacaoIA
  origem (WHATSAPP|DASHBOARD), criadoEm }

model Mensagem { id, pacienteId, conteudo
  remetente (PACIENTE|SISTEMA|IA|PROFISSIONAL)
  tipo (TEXTO|IMAGEM|TEMPLATE), criadoEm }
  @@index([pacienteId, criadoEm])

model Assinatura { id, clinicaId, plano, status
  fimPeriodoAtual, stripeAssinaturaId, cancelarNoFim }

model Pagamento { id, assinaturaId, valor, status
  gateway, gatewayId, urlFatura, criadoEm }


09 · SEGURANÇA & QUALIDADE
Checklist de Segurança Obrigatória
   •   JWT 15min + Refresh Token no Redis (7 dias) — nunca JWT de longa duração
   •   Argon2 para hash de senhas
   •   Rate limiting por IP e por usuário autenticado
   •   Zod validation em TODOS os endpoints
   •   CORS configurado apenas para domínios autorizados
   •   Dados sensíveis nunca expostos em respostas de API (senhaHash, tokens)
   •   HTTPS obrigatório em produção — Nginx + Let's Encrypt
   •   Variáveis de ambiente: nunca commitar .env — usar .env.example


Checklist de Qualidade de UI
   •   Todos os textos, labels e mensagens em Português BR
   •   Design System aplicado 100%: apenas tokens de cor definidos
   •   Responsivo: mobile 375px e desktop 1440px testados
   •   Estados de loading com skeleton ou spinner em todas as listagens
   •   Estados de erro com mensagem clara em PT-BR e ação de retry
   •   Estados vazios com ilustração e call-to-action
   •   Acessibilidade: contraste mínimo 4.5:1, foco visível em teclado
   •   Fontes Inter + Poppins carregadas via Google Fonts no HTML
   •   Estilo premium consistente: sidebar branca, cards com borda sutil e sombra leve
   •   Ícones premium (Lucide) no lugar de emojis em toda a UI
   •   Tipografia com hierarquia clara e títulos com tracking discreto
   •   Blocos e painéis com visual clean, espaços amplos e superfície clara


10 · DEPLOY & INFRAESTRUTURA
🤖  PROMPT PARA IDE — DOCKER COMPOSE — AMBIENTE COMPLETO
services:
  postgres:
    image: postgres:16-alpine
    environment: POSTGRES_DB=glucoia, POSTGRES_USER=glucoia
    volumes: dados_postgres:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_SENHA}

  backend:
    build: ./apps/backend
    environment: URL_BANCO, URL_REDIS, JWT_SEGREDO,
                 OPENAI_CHAVE, WHATSAPP_TOKEN, STRIPE_CHAVE

  ia-worker:
    build: ./workers/ia-worker

  frontend:
    build: ./apps/frontend

  nginx:
    image: nginx:alpine
    volumes: ./infra/nginx/nginx.conf:/etc/nginx/nginx.conf
    ports: 80:80, 443:443

Nginx: /api/* → backend | /* → frontend
SSL: certbot + Let's Encrypt automático
Gzip: ativado para assets estáticos


✅ Checklist Final Pré-Lançamento
   •   Design System Gluco IA aplicado em 100% das telas
   •   Todos os textos em Português BR — zero texto em inglês na UI
   •   GaugeGlicemia funcionando com animação e cores corretas
   •   BarraNavegacaoInferior mobile funcionando com rota ativa destacada
   •   Dashboard desktop com KPIs, sparklines e painel de IA lateral
   •   Login com JWT funcional, redirecionamento por perfil
   •   Glicemia via WhatsApp registrada e análise da IA respondida
   •   Foto de refeição gera análise completa com orientação em PT-BR
   •   CI/CD passando: lint + type-check + build + deploy
   •   HTTPS ativo com certificado válido


