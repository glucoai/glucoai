
GLUCO
IA


ANÁLISE DE GAPS + FUNCIONALIDADES FUTURAS
Comparativo entre os documentos técnicos originais e o Roadmap atual

Campo
Detalhe
Objetivo
Identificar funcionalidades ausentes no Roadmap atual
Fontes analisadas
0__GERALIDADES.pdf · 1__DASHBOARD.pdf · 2__PACIENTES.pdf
Comparado com
GlucoIA_PRD_Supremo_v2 + GlucoIA_Roadmap_v2
Resultado
3 categorias: ❌ Ausente · ⚠️ Parcial · ✅ Existe
Documento
Funcionalidades futuras com prompts para IDE incluídos


01 · SUMÁRIO EXECUTIVO — O QUE FALTA
Após análise completa dos 3 PDFs do documento técnico original, foram identificadas as seguintes categorias de gap:



Categoria
Quantidade de gaps
Impacto
❌
Completamente ausentes no Roadmap
11 funcionalidades
Alto — mudam a arquitetura
⚠️
Parcialmente cobertas
7 funcionalidades
Médio — precisam de expansão
✅
Já no Roadmap
Módulos core OK
—


⚡ Funcionalidades críticas ausentes (implementar antes do lançamento)
   •   Perfil de Suporte — 4º nível de acesso não mapeado em nenhuma fase
   •   Recuperação de senha — fluxo de reset ausente no módulo de autenticação
   •   Plano gratuito vs. pago — diferenciação de features por plano não implementada
   •   Questionário sequencial de onboarding — coleta automática de dados clínicos
   •   Idioma detectado automaticamente — personalização de mensagens por idioma
   •   Radar Metabólico — painel de risco com score 0-100, o módulo mais poderoso do sistema


🛠️ Módulos completos ausentes (implementar pós-MVP)
   •   Módulo CRM — gestão de relacionamento com leads e pacientes
   •   Módulo Automações — fluxos automáticos por gatilho
   •   Módulo Funcionários — gestão da equipe interna
   •   Módulo Integrações — conexões com sistemas externos
   •   Módulo Configurações — parametrização completa do sistema


02 · TABELA COMPLETA DE GAPS
Mapeamento funcionalidade a funcionalidade, comparando os PDFs originais com o Roadmap atual.

📁 0__GERALIDADES.pdf — Gaps identificados
Funcionalidade
Fonte (PDF)
Status no Roadmap
Prioridade
Perfil: Suporte (4º nível)
GERALIDADES p.2
❌ Ausente
🔴 Alta
Recuperação de senha
GERALIDADES p.3
❌ Ausente
🔴 Alta
Menu: CRM
GERALIDADES p.3
❌ Ausente
🟡 Média
Menu: Automações
GERALIDADES p.3
❌ Ausente
🟡 Média
Menu: Funcionários
GERALIDADES p.3
❌ Ausente
🟡 Média
Menu: Configurações
GERALIDADES p.3
❌ Ausente
🟡 Média
Menu: Integrações
GERALIDADES p.3
❌ Ausente
🟢 Baixa
Login e controle de sessão
GERALIDADES p.3
✅ Existe
—
3 perfis básicos (Admin/Prof/Pac.)
GERALIDADES p.2
✅ Existe
—


📊 1__DASHBOARD.pdf — Gaps identificados
Funcionalidade
Fonte (PDF)
Status no Roadmap
Prioridade
Radar Metabólico (módulo completo)
DASHBOARD p.6-15
❌ Ausente
🔴 Alta
Score metabólico 0-100 (algoritmo)
DASHBOARD p.12
❌ Ausente
🔴 Alta
Ações automáticas por faixa de risco
DASHBOARD p.12-13
❌ Ausente
🔴 Alta
Painel de Engajamento dos Pacientes
DASHBOARD p.5
❌ Ausente
🔴 Alta
Assinaturas por tipo (mensal/trim./anual)
DASHBOARD p.1
⚠️ Parcial
🔴 Alta
Pacientes adimplentes/inadimplentes
DASHBOARD p.1
⚠️ Parcial
🟡 Média
Pacientes sem glicemia registrada > 24h
DASHBOARD p.1
⚠️ Parcial
🔴 Alta
Pacientes sem interação > 3 dias
DASHBOARD p.5
❌ Ausente
🔴 Alta
Predições glicêmicas feitas (KPI)
DASHBOARD p.3
❌ Ausente
🟡 Média
Protocolos ativados (KPI)
DASHBOARD p.3
❌ Ausente
🟡 Média
Filtros avançados no Radar (9 filtros)
DASHBOARD p.13
❌ Ausente
🟡 Média
KPIs financeiros (MRR gráfico)
DASHBOARD p.1
⚠️ Parcial
🟡 Média
Alertas clínicos ativos (tabela)
DASHBOARD p.3
⚠️ Parcial
🟡 Média
Atividade do sistema — contadores IA
DASHBOARD p.3
⚠️ Parcial
🟡 Média


👥 2__PACIENTES.pdf — Gaps identificados
Funcionalidade
Fonte (PDF)
Status no Roadmap
Prioridade
Plano gratuito vs. plano pago
PACIENTES p.1
❌ Ausente
🔴 Alta
Questionário sequencial no upgrade
PACIENTES p.1
❌ Ausente
🔴 Alta
Idioma detectado automaticamente
PACIENTES p.1
❌ Ausente
🟡 Média
Histórico de complicações clínicas
PACIENTES p.1
❌ Ausente
🔴 Alta
Maior glicemia já registrada
PACIENTES p.1
❌ Ausente
🟡 Média
Sintomas atuais
PACIENTES p.1
❌ Ausente
🟡 Média
Presença de glicosímetro
PACIENTES p.1
❌ Ausente
🟡 Média
Principais dificuldades no controle
PACIENTES p.1
❌ Ausente
🟡 Média
Correlação predição alimentar vs. glicemia
PACIENTES p.2
❌ Ausente
🟡 Média
Campos básicos (nome, telefone, etc.)
PACIENTES p.1
✅ Existe
—
Tipo de diabetes, medicamentos
PACIENTES p.1
✅ Existe
—


03 · GAPS CRÍTICOS — DETALHAMENTO
Funcionalidades ausentes que impactam o lançamento. Devem ser incorporadas ao Roadmap v2 antes do MVP.

🔐 Gap 1 — Recuperação de Senha
Ausente completamente no módulo de autenticação. Funcionalidade básica obrigatória.

🤖  PROMPT PARA IDE — RECUPERAÇÃO DE SENHA — Inserir na Fase 3 do Roadmap
Adicione ao módulo de autenticação:

BACKEND:
  POST /autenticacao/esqueci-senha
    → recebe { email }
    → gera token seguro (crypto.randomBytes(32).toString('hex'))
    → salva no Redis com TTL 1h: reset:{token} = userId
    → envia e-mail com link: https://app.glucoia.com/redefinir-senha?token=...

  POST /autenticacao/redefinir-senha
    → recebe { token, novaSenha, confirmarSenha }
    → valida token no Redis
    → atualiza senhaHash com Argon2
    → invalida token no Redis
    → retorna 200

FRONTEND — Tela 'Esqueci minha senha':
  Link 'Esqueceu sua senha?' na tela de Login
  Tela: campo E-mail + botão 'Enviar link de recuperação'
  Feedback: 'Enviamos um link para [e-mail] se ele estiver cadastrado.'

FRONTEND — Tela 'Redefinir senha':
  Acessada via link do e-mail com ?token=...
  Campos: Nova senha / Confirmar nova senha
  Validação: mínimo 8 caracteres, 1 número, 1 maiúscula
  Sucesso: redireciona para Login com toast 'Senha redefinida com sucesso!'


👤 Gap 2 — Perfil de Suporte (4º Nível de Acesso)
Permissões do perfil Suporte (definidas no PDF GERALIDADES p.2)
   •   Visualizar pacientes e evolução glicêmica
   •   Acompanhar histórico alimentar
   •   Acessar orientações geradas pela IA
   •   Verificar problemas de cadastro
   •   Suporte operacional — sem acesso financeiro ou de configuração
   •   NÃO pode editar dados clínicos nem enviar mensagens


🤖  PROMPT PARA IDE — PERFIL SUPORTE — Inserir na Fase 3 do Roadmap
Adicione o 4º perfil ao sistema de autenticação:

BACKEND — Atualizar enum Perfil no Prisma:
  enum Perfil { ADMINISTRADOR PROFISSIONAL SUPORTE PACIENTE }

BACKEND — Atualizar middleware exigirPerfil():
  Suporte pode: GET /pacientes, GET /glicemias, GET /refeicoes, GET /mensagens
  Suporte NÃO pode: POST/PUT/DEL /pacientes, qualquer rota financeira,
                     configurações, funcionários, automações

FRONTEND — Sidebar para perfil Suporte:
  Menu visível: Pacientes | Mensagens | (sem Financeiro, sem Config)
  Botões de editar/excluir desabilitados (visualmente acinzentados)
  Badge 'Suporte' no cabeçalho ao lado do nome do usuário


💳 Gap 3 — Plano Gratuito vs. Plano Pago
Lógica definida no PDF PACIENTES p.1
   •   Plano Gratuito: dados básicos coletados no início (lead/onboarding inicial)
   •   Plano Pago: questionário sequencial adicional ativado automaticamente no upgrade
   •   O sistema deve bloquear features premium para pacientes no plano gratuito
   •   Análise de IA de refeições: somente no plano pago
   •   Histórico completo: somente no plano pago


🤖  PROMPT PARA IDE — PLANOS GRATUITO/PAGO — Inserir na Fase 7 do Roadmap
Implemente diferenciação de planos para pacientes:

BACKEND — Atualizar model Paciente:
  plano: enum PlanoPaciente { GRATUITO BASICO PREMIUM }
  planoAtivadoEm, questionarioConcluidoEm

BACKEND — Middleware verificarPlanoPaciente():
  Rotas restritas ao plano pago:
  - POST /refeicoes (análise IA de foto)
  - GET /pacientes/:id/glicemias/estatisticas (stats avançadas)
  - GET /pacientes/:id/relatorio
  Resposta para plano gratuito:
  { erro: 'PLANO_RESTRITO', mensagem: 'Faça upgrade para acessar esta função' }

BACKEND — Questionário sequencial (ativado no upgrade):
  POST /pacientes/:id/questionario
  Perguntas adicionais no upgrade (via WhatsApp, sequencial):
    1. 'Você usa algum medicamento para diabetes? Qual?'
    2. 'Você tem glicosímetro em casa?'
    3. 'Quais são suas principais dificuldades no controle?'
    4. 'Você já teve alguma complicação de saúde relacionada ao diabetes?'
    5. 'Qual foi a sua glicemia mais alta que já registrou?'
  Salva respostas em Paciente.dadosClinicoCompleto (Json)

FRONTEND — Badge de plano no perfil do paciente:
  BadgePlano: 'Gratuito' (cinza) | 'Básico' (azul) | 'Premium' (verde)
  CTA de upgrade visível para pacientes no plano gratuito


🎯 Gap 4 — Radar Metabólico (módulo mais poderoso)
Descrito em detalhe no PDF DASHBOARD (páginas 6 a 15). Este é o módulo diferenciador do Gluco IA — transforma a plataforma de chatbot em sistema de gestão populacional.

Estrutura do Radar Metabólico conforme especificação original
   •   Faixa superior: cards de resumo — Total / Baixo risco / Moderado / Alto / Crítico / Sem dados
   •   Faixa central: gráfico de barras ou rosca — distribuição de risco da base
   •   Faixa principal: tabela priorizada com colunas: Nome / Última glicemia / Média 7d / Tendência / Adesão alimentar / Status financeiro / Risco / Ação recomendada
   •   Faixa lateral: alertas prioritários — críticos 24h / sem glicemia 48h / piora rápida / hiperglicemia recorrente / risco clínico + inadimplência
   •   Filtros: 9 dimensões de filtragem (risco / tipo / cidade / profissional / plano / etc.)


Variável do Score
Critério
Peso
Faixa
A. Nível glicêmico atual
≤140 pts / 141-180 / 181-250 / >250
25 pts
Score mais alto = mais risco
B. Média glicêmica 7 e 14 dias
Quanto maior a média, maior o score
20 pts
Calculado automaticamente
C. Tendência glicêmica
Melhorando / Estável / Piorando
15 pts
Piorando = pontuação máxima
D. Frequência de hiperglicemia
0-1 ep. / 2-4 ep. / 5+ ep. (últimos 7d)
15 pts
5+ episódios = alto impacto
E. Adesão ao monitoramento
Frequente / 2-3d sem envio / Ausência longa
10 pts
Ausência prolongada = risco alto
F. Adesão alimentar
% de refeições adequadas (análise IA)
10 pts
Alta carga glicêmica = mais risco
G. Histórico clínico no onboarding
Complicações, HAS, problemas renais, etc.
5 pts
Score basal mais alto


Faixa
Score
Nome
Ação automática
🟢 Baixo
0 – 20
Bom controle e boa adesão
Mensagem de parabéns + conteúdo leve
🟡 Moderado
21 – 40
Oscilações sem padrão grave
Lembrete extra + reforço alimentar
🟠 Alto
41 – 65
Descontrole consistente
Priorizar dashboard + fluxo de atenção
🔴 Crítico
66 – 100
Risco imediato + baixa adesão
Alerta máximo + tarefa de contato humano
⚪ Sem dados
—
Poucos registros / novo
Incentivar uso + completar onboarding


🤖  PROMPT PARA IDE — RADAR METABÓLICO — Nova fase no Roadmap (F10)
Implemente o módulo Radar Metabólico do Gluco IA:

BACKEND (src/modulos/radar-metabolico):

  utils/scoreMetabolico.ts:
    calcularScore(pacienteId): Promise<ScoreMetabolico>
      A. Busca última glicemia → 0-25 pts conforme faixa
      B. Média 7d e 14d → 0-20 pts
      C. Tendência (regressão linear simples nos últimos 7d) → 0-15 pts
      D. Conta glicemias > 180 nos últimos 7d → 0-15 pts
      E. Dias sem registro nos últimos 7d → 0-10 pts
      F. % refeições com IG alto nos últimos 7d → 0-10 pts
      G. Lê Paciente.historicoComplicacoes → 0-5 pts
      Total: 0-100 → classifica em BAIXO|MODERADO|ALTO|CRITICO|SEM_DADOS
      Salva em cache Redis: score:{pacienteId} TTL 6h

  GET /radar-metabolico/resumo → { total, baixo, moderado, alto, critico, semDados }
  GET /radar-metabolico/pacientes → lista paginada priorizada (crítico primeiro)
    queryParams: risco, tipo, cidade, profissional, plano, adimplente, pagina
  GET /radar-metabolico/alertas → listas de alertas prioritários
  POST /radar-metabolico/recalcular → recalcula scores (job BullMQ, roda 1x/hora)

FRONTEND — Tela Radar Metabólico (src/paginas/RadarMetabolico):

  Linha 1 — Cards de resumo (6 cards):
    Total monitorados / Baixo / Moderado / Alto / Crítico / Sem dados
    Card Crítico: borda vermelha pulsante se count > 0

  Linha 2 — Gráfico de distribuição:
    PieChart Recharts com 5 fatias coloridas (verde/amarelo/laranja/vermelho/cinza)
    Legenda com percentual de cada faixa

  Linha 3 — Tabela priorizada:
    Colunas: Avatar | Nome | Últ. Glicemia | Média 7d | Tendência |
             Adesão | Status Financeiro | Score | Risco | Ação
    Coluna Tendência: seta verde (↗ melhorando) / cinza (→ estável) / vermelho (↘ piorando)
    Coluna Ação: botão 'Contatar' ou 'Ver perfil' conforme nível de risco
    Linha crítica: background #FEF0F0 + badge pulsante

  Coluna lateral direita — Alertas prioritários:
    🔴 Críticos nas últimas 24h
    🟡 Sem glicemia há 48h+
    📉 Piora rápida (7d)
    🔄 Hiperglicemia recorrente
    ⚠️ Risco clínico + inadimplente

  Barra de filtros:
    SeletorFiltro: Risco | Tipo | Cidade | Profissional | Plano | Adimplência


📊 Gap 5 — Painel de Engajamento dos Pacientes
Especificação conforme DASHBOARD p.5
   •   Pacientes ativos hoje (enviaram pelo menos 1 mensagem ou glicemia)
   •   Pacientes sem interação há mais de 3 dias — lista para contato
   •   Pacientes sem glicemia registrada nas últimas 24h — lista de acompanhamento
   •   Deve aparecer no Dashboard principal como seção abaixo dos KPIs financeiros


🤖  PROMPT PARA IDE — PAINEL DE ENGAJAMENTO — Adicionar ao Dashboard
Adicione seção de engajamento ao Painel (Fase 4 do Roadmap):

BACKEND:
  GET /painel/engajamento →
    ativosHoje: count (glicemia ou mensagem nas últimas 24h)
    semInteracao3dias: lista de pacientes (nome, telefone, últimaInteração)
    semGlicemia24h: lista de pacientes (nome, telefone, úlima glicemia)
  Cache Redis: TTL 30 minutos

FRONTEND — Seção 'Engajamento dos Pacientes' no Painel:
  3 cards horizontais:
    🟢 Ativos hoje: número grande + barra de progresso vs. total
    🟡 Sem interação 3 dias: número com link 'Ver lista'
    🔴 Sem glicemia 24h: número com badge pulsante se > 10%
  Ao clicar 'Ver lista': drawer lateral com tabela Nome | Telefone | Última interação
  Botão 'Enviar lembrete em massa' (aciona automação WhatsApp)


04 · MÓDULOS FUTUROS — ROADMAP EXPANDIDO
Funcionalidades identificadas nos PDFs que não estão no roadmap atual e devem ser planejadas para versões pós-MVP.

📋 Módulo CRM — Gestão de Relacionamento
Mencionado no menu principal do sistema (GERALIDADES p.3). Necessário para gestão de leads antes de se tornarem pacientes pagos.

Funcionalidades do Módulo CRM
   •   Pipeline de leads: Novo Lead → Qualificado → Em negociação → Convertido → Perdido
   •   Registro de contatos com data, canal e resultado
   •   Origem do lead: WhatsApp orgânico / indicação / campanha
   •   Conversão de lead em paciente com 1 clique
   •   Taxa de conversão por período e por profissional
   •   Funil visual com contagem por etapa
   •   Filtros: período, canal, profissional, status


🤖  PROMPT PARA IDE — CRM — Fase F11 (pós-MVP)
Implemente o módulo CRM do Gluco IA:

BACKEND:
  model Lead { id, clinicaId, nome, telefone, email?,
    origem: WHATSAPP|INDICACAO|CAMPANHA|ORGANICO
    etapa: NOVO|QUALIFICADO|NEGOCIACAO|CONVERTIDO|PERDIDO
    criadoEm, ultimoContatoEm, observacoes, responsavelId }

  GET  /crm/leads?etapa=&periodo=&responsavel=
  POST /crm/leads
  PUT  /crm/leads/:id (mover entre etapas)
  POST /crm/leads/:id/converter → cria Paciente a partir do Lead
  GET  /crm/metricas → taxas de conversão por etapa e período

FRONTEND:
  Kanban visual: 5 colunas, cards arrastáveis (drag and drop)
  Card do lead: nome + telefone + origem + dias na etapa
  Botão 'Converter em paciente' no card da etapa Qualificado+
  Gráfico de funil de conversão na lateral


⚙️ Módulo Automações — Fluxos Automáticos
Funcionalidades do Módulo Automações
   •   Criação de fluxos por gatilho: glicemia alta / sem registro / aniversário / inatividade
   •   Ações disponíveis: enviar mensagem WhatsApp / criar tarefa / notificar profissional
   •   Agendamento de mensagens: lembretes diários, semanais
   •   Biblioteca de templates de mensagem em PT-BR
   •   Histórico de execuções de automação por paciente
   •   Ativar/desativar automações por plano da clínica


🤖  PROMPT PARA IDE — AUTOMAÇÕES — Fase F12 (pós-MVP)
Implemente o módulo de Automações:

BACKEND:
  model Automacao { id, clinicaId, nome, ativo, gatilho:
    GLICEMIA_ALTA|GLICEMIA_CRITICA|SEM_REGISTRO_24H|SEM_INTERACAO_3D|
    ANIVERSARIO|NOVO_PACIENTE|UPGRADE_PLANO
    condicao (Json), acao: WHATSAPP|NOTIFICACAO|TAREFA
    templateMensagem, criadoEm }

  model ExecucaoAutomacao { id, automacaoId, pacienteId,
    executadoEm, resultado, erro? }

  Worker: automacaoWorker.ts — roda a cada 15min via BullMQ
    1. Busca automações ativas
    2. Avalia condições para cada paciente
    3. Executa ação e registra em ExecucaoAutomacao

FRONTEND:
  Lista de automações com toggle ativo/inativo
  Modal de criação: selecionar gatilho → definir condição → escolher ação → template
  Preview da mensagem em tempo real
  Histórico de execuções por automação


👥 Módulo Funcionários — Gestão da Equipe
Funcionalidades do Módulo Funcionários
   •   Cadastro de profissionais: nome, e-mail, perfil, especialidade
   •   Atribuição de pacientes por profissional
   •   Métricas por profissional: pacientes ativos, mensagens enviadas, tempo de resposta
   •   Controle de acesso granular: habilitar/desabilitar módulos por usuário
   •   Log de atividades da equipe
   •   Perfis disponíveis: Administrador / Profissional de Saúde / Suporte


🤖  PROMPT PARA IDE — FUNCIONÁRIOS — Fase F11 (pós-MVP)
Implemente o módulo de gestão da equipe:

BACKEND:
  GET  /funcionarios
  POST /funcionarios → convida por e-mail (envia link de cadastro)
  PUT  /funcionarios/:id → atualiza perfil e permissões
  DEL  /funcionarios/:id → desativa acesso (soft delete)
  GET  /funcionarios/:id/metricas → pacientes, mensagens, response time
  PUT  /funcionarios/:id/pacientes → atribuir/remover pacientes

FRONTEND:
  Tabela: Avatar | Nome | Perfil | Pacientes atribuídos | Último acesso | Ações
  Modal de convite: e-mail + perfil + especialidade
  Página de métricas por funcionário com gráficos
  Drag-and-drop para redistribuição de pacientes entre profissionais


⚙️ Módulo Configurações
Funcionalidades do Módulo Configurações
   •   Configurações da clínica: nome, logotipo, fuso horário, moeda
   •   Configurações de notificações: quais alertas ativar e para quem
   •   Metas glicêmicas padrão por tipo de diabetes
   •   Personalização de mensagens da IA (tom, frequência)
   •   Gestão de planos e preços da clínica
   •   Configurações do WhatsApp Business (número, templates)
   •   Backup e exportação de dados


🔗 Módulo Integrações
Funcionalidades do Módulo Integrações
   •   Integração com Google Calendar (agendar consultas)
   •   Integração com sistemas de prontuário (HIS/EMR) via API
   •   Exportação para Excel/CSV de dados glicêmicos
   •   Webhook customizável para sistemas externos
   •   Zapier/Make connector para automações externas
   •   API pública documentada (Swagger) para integrações customizadas


🏥 Campos Clínicos Adicionais no Cadastro do Paciente
Campos presentes no PDF PACIENTES p.1 mas ausentes no schema Prisma atual:

🤖  PROMPT PARA IDE — CAMPOS CLÍNICOS — Adicionar ao Schema (Fase 4)
Atualize o model Paciente no Prisma com os campos ausentes:

model Paciente {
  // campos já existentes...

  // NOVOS CAMPOS DO PDF:
  idioma             String  @default('pt-BR') // detectado automaticamente pelo WhatsApp
  historicoComplicacoes String[] // ex: ['renal', 'cardiovascular', 'úlcera', 'AVC']
  maiorGlicemiaRegistrada Float?  // preenchido no onboarding
  sintomasAtuais     String[] // ex: ['fadiga', 'visão turva', 'sede excessiva']
  temGlicosimetro    Boolean  @default(false)
  principaisDificuldades String[] // ex: ['dieta', 'esquecer de registrar', 'custo']
  dadosClinicos      Json?    // respostas completas do questionário sequencial

  // PLANO DO PACIENTE:
  plano              PlanoPaciente @default(GRATUITO)
  planoAtivadoEm     DateTime?
  questionarioConcluidoEm DateTime?
}

ONBOARDING via WhatsApp — fluxo de detecção de idioma:
  1. Ao receber primeira mensagem do paciente:
     → GPT-4o identifica idioma da mensagem
     → Salva Paciente.idioma = 'pt-BR' | 'en' | 'es' | ...
     → Todas as próximas mensagens da IA nesse idioma


🔬 Validação: Correlação Predição Alimentar vs. Glicemia Pós-Prandial
Mencionada no PDF PACIENTES p.2 como ponto de validação importante. Feature analítica avançada para versão pós-MVP.

Como implementar a correlação (proposta técnica)
   •   Ao analisar uma refeição: salvar a estimativa de impacto glicêmico (ex: +40-60 mg/dL)
   •   Após 1h a 2h da refeição: enviar lembrete ao paciente para registrar glicemia pós-prandial
   •   Calcular correlação: estimativa IA vs. glicemia real medida
   •   Painel de precisão da IA: % de previsões dentro de ±30 mg/dL, ±50 mg/dL
   •   Usar dados para ajustar prompts da IA ao longo do tempo (fine-tuning contínuo)
   •   Exibir score de precisão por tipo de refeição no painel do administrador


05 · ROADMAP EXPANDIDO — FASES ADICIONAIS
Fases 10 a 14 sugeridas para incorporar as funcionalidades ausentes. Executar após o lançamento do MVP (Fases 1-9).

Fase
Nome
Entregável
Pré-requisito
F10
Radar Metabólico
Score 0-100 + tabela priorizada + alertas automáticos
Fases 1-5 concluídas
F11
CRM + Funcionários
Pipeline de leads + gestão de equipe
Fase 3 (Auth) concluída
F12
Automações
Fluxos por gatilho + templates WhatsApp
Fase 5 (WhatsApp) concluída
F13
Configurações + Planos
Parametrização + plano gratuito/pago
Fase 7 (Financeiro) concluída
F14
Integrações + API Pública
Webhooks + Swagger + exportações
Fases 1-9 concluídas


F10  ·  Radar Metabólico  ·  4-6 semanas pós-MVP
🔴  Score metabólico 0-100 calculado por worker (1x/hora via BullMQ)
🔴  Endpoint GET /radar-metabolico/pacientes com paginação e 9 filtros
🔴  Tela completa: 6 cards de resumo + PieChart + tabela priorizada + alertas laterais
🔴  Ações automáticas por faixa: mensagem WhatsApp + tarefa de contato
🔴  Recalculo automático ao registrar nova glicemia ou refeição


F11  ·  CRM + Funcionários  ·  3-4 semanas
🔴  Model Lead com pipeline de 5 etapas e kanban visual (drag-and-drop)
🔴  Conversão de lead em paciente com 1 clique
🔴  Gestão de funcionários: convite por e-mail, perfis, atribuição de pacientes
🔴  Métricas por profissional no dashboard


F12  ·  Automações  ·  3 semanas
🔴  7 gatilhos de automação: glicemia alta, sem registro, inatividade, aniversário...
🔴  Worker de automação rodando a cada 15min
🔴  Interface visual: criar fluxo com seletor de gatilho + condição + ação
🔴  Biblioteca de templates de mensagem em PT-BR


F13  ·  Configurações + Planos de Paciente  ·  2-3 semanas
🔴  Plano gratuito vs. pago com bloqueio de features premium
🔴  Questionário sequencial automático no upgrade (via WhatsApp)
🔴  Configurações da clínica: logotipo, fuso, moeda, metas padrão
🔴  Campos clínicos adicionais: complicações, glicosímetro, dificuldades
🔴  Idioma detectado automaticamente na primeira mensagem


F14  ·  Integrações + Validação IA  ·  4 semanas
🔴  API pública documentada com Swagger
🔴  Webhooks customizáveis para sistemas externos
🔴  Exportação de dados em CSV/Excel
🔴  Rastreamento de precisão da IA: predição alimentar vs. glicemia real
🔴  Painel de performance da IA com score de acurácia por tipo de refeição


06 · INSTRUÇÕES PARA O AGENTE DE DESENVOLVIMENTO
Este documento deve ser consultado pelo agente ao iniciar qualquer trabalho nas fases 1-9, para garantir que os gaps identificados sejam corrigidos durante o desenvolvimento.

📌 Ajustes obrigatórios nas Fases 1-9 existentes
   •   FASE 3 (Auth): adicionar recuperação de senha + perfil de Suporte ao enum Perfil
   •   FASE 4 (Pacientes): adicionar campos clínicos ausentes ao schema Prisma
   •   FASE 4 (Dashboard): adicionar seção de Engajamento dos Pacientes + KPIs operacionais da IA
   •   FASE 7 (Financeiro): adicionar plano gratuito/pago + questionário sequencial no upgrade
   •   FASE 8 (Mensagens): adicionar contadores de KPI (predições feitas, protocolos ativados)


📌 Novos módulos do menu principal (adicionar ao layout da sidebar)
   •   CRM — entre Pacientes e Mensagens na sidebar
   •   Automações — abaixo de Mensagens
   •   Funcionários — visível somente para perfil Administrador
   •   Configurações — no rodapé da sidebar (ícone de engrenagem)
   •   Integrações — dentro de Configurações (submenu ou aba)


📌 Ordem de implementação recomendada
   •   1. Primeiro: aplicar ajustes nas Fases 1-9 (recuperação de senha, campos, planos)
   •   2. Segundo (F10): Radar Metabólico — diferenciador competitivo do produto
   •   3. Terceiro (F11): CRM + Funcionários — necessário para operação da clínica
   •   4. Quarto (F12): Automações — aumenta retenção e reduz trabalho manual
   •   5. Quinto (F13-14): Configurações + Integrações — acabamento do produto


