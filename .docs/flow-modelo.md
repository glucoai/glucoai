{
"version": "7.3",
"screens": \[
{
"id": "BREAK\_PATTERN",
"title": "Uma pergunta rápida 😄",
"data": {},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextHeading",
"text": "Antes da gente começar…"
},
{
"type": "TextBody",
"text": "Deixa eu te perguntar uma coisa 😄\n(Sem julgamentos… estamos juntos nisso 🤝)"
},
{
"type": "TextBody",
"text": "👉 Você é do tipo que:"
},
{
"type": "RadioButtonsGroup",
"label": "Escolha uma opção:",
"name": "controle\_glicemia",
"required": true,
"data-source": \[
{
"id": "controlado",
"title": "1️⃣ Controla direitinho"
},
{
"id": "descuidado",
"title": "2️⃣ Lembra quando dá problema"
}
]
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "CONTEXT"
},
"payload": {
"controle\_glicemia": "${form.controle\_glicemia}"
}
}
}
]
}
,
{
"id": "STEP\_EMAIL",
"title": "Seu E-mail (110%)",
"data": {
"controle\_glicemia": { "type": "string", "**example**": "controlado" },
"nome\_completo": { "type": "string", "**example**": "João Silva" },
"sexo": { "type": "string", "**example**": "masculino" },
"tipo\_diabetes": { "type": "string", "**example**": "tipo1" },
"anos\_diabetes": { "type": "string", "**example**": "1a3" },
"situacao\_atual": { "type": "string", "**example**": "controlado" },
"emergencia": { "type": "string", "**example**": "nao" },
"pico\_glicemia": { "type": "string", "**example**": "150_200" },
"tem\_glicosimetro": { "type": "string", "**example**": "sim" },
"frequencia\_controle": { "type": "string", "**example**": "sim\_certinho" },
"alimentacao": { "type": "string", "**example**": "controlada" },
"sintomas": { "type": "array", "items": { "type": "string" } },
"peso": { "type": "string", "**example**": "75" },
"altura": { "type": "string", "**example**": "h171" }
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{ "type": "TextBody", "text": "Progresso: ██████████ 110%" },
{ "type": "TextBody", "text": "Qual é o seu e-mail?" },
{
"type": "TextInput",
"label": "E-mail",
"name": "email",
"required": true,
"input-type": "text",
"helper-text": "Ex: nome@email.com"
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": { "type": "screen", "name": "STEP\_IDADE" },
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${data.situacao\_atual}",
"emergencia": "${data.emergencia}",
"pico\_glicemia": "${data.pico\_glicemia}",
"tem\_glicosimetro": "${data.tem\_glicosimetro}",
"frequencia\_controle": "${data.frequencia\_controle}",
"alimentacao": "${data.alimentacao}",
"sintomas": "${data.sintomas}",
"peso": "${data.peso}",
"altura": "${data.altura}",
"email": "${form.email}"
}
}
}
]
}
},
{
"id": "STEP\_IDADE",
"title": "Sua Idade (120%)",
"data": {
"controle\_glicemia": { "type": "string", "**example**": "controlado" },
"nome\_completo": { "type": "string", "**example**": "João Silva" },
"sexo": { "type": "string", "**example**": "masculino" },
"tipo\_diabetes": { "type": "string", "**example**": "tipo1" },
"anos\_diabetes": { "type": "string", "**example**": "1a3" },
"situacao\_atual": { "type": "string", "**example**": "controlado" },
"emergencia": { "type": "string", "**example**": "nao" },
"pico\_glicemia": { "type": "string", "**example**": "150_200" },
"tem\_glicosimetro": { "type": "string", "**example**": "sim" },
"frequencia\_controle": { "type": "string", "**example**": "sim\_certinho" },
"alimentacao": { "type": "string", "**example**": "controlada" },
"sintomas": { "type": "array", "items": { "type": "string" } },
"peso": { "type": "string", "**example**": "75" },
"altura": { "type": "string", "**example**": "h171" },
"email": { "type": "string", "**example**": "nome@email.com" }
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{ "type": "TextBody", "text": "Progresso: ██████████ 120%" },
{ "type": "TextBody", "text": "Qual é a sua idade?" },
{
"type": "TextInput",
"label": "Idade",
"name": "idade",
"required": true,
"input-type": "number",
"helper-text": "Ex: 42"
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": { "type": "screen", "name": "STEP\_DATA\_NASCIMENTO" },
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${data.situacao\_atual}",
"emergencia": "${data.emergencia}",
"pico\_glicemia": "${data.pico\_glicemia}",
"tem\_glicosimetro": "${data.tem\_glicosimetro}",
"frequencia\_controle": "${data.frequencia\_controle}",
"alimentacao": "${data.alimentacao}",
"sintomas": "${data.sintomas}",
"peso": "${data.peso}",
"altura": "${data.altura}",
"email": "${data.email}",
"idade": "${form.idade}"
}
}
}
]
}
},
{
"id": "STEP\_DATA\_NASCIMENTO",
"title": "Data de Nascimento (130%)",
"data": {
"controle\_glicemia": { "type": "string", "**example**": "controlado" },
"nome\_completo": { "type": "string", "**example**": "João Silva" },
"sexo": { "type": "string", "**example**": "masculino" },
"tipo\_diabetes": { "type": "string", "**example**": "tipo1" },
"anos\_diabetes": { "type": "string", "**example**": "1a3" },
"situacao\_atual": { "type": "string", "**example**": "controlado" },
"emergencia": { "type": "string", "**example**": "nao" },
"pico\_glicemia": { "type": "string", "**example**": "150_200" },
"tem\_glicosimetro": { "type": "string", "**example**": "sim" },
"frequencia\_controle": { "type": "string", "**example**": "sim\_certinho" },
"alimentacao": { "type": "string", "**example**": "controlada" },
"sintomas": { "type": "array", "items": { "type": "string" } },
"peso": { "type": "string", "**example**": "75" },
"altura": { "type": "string", "**example**": "h171" },
"email": { "type": "string", "**example**": "nome@email.com" },
"idade": { "type": "string", "**example**": "42" }
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{ "type": "TextBody", "text": "Progresso: ██████████ 130%" },
{ "type": "TextBody", "text": "Qual é a sua data de nascimento?" },
{
"type": "TextInput",
"label": "Data de nascimento",
"name": "data\_nascimento",
"required": false,
"input-type": "text",
"helper-text": "DD/MM/AAAA"
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": { "type": "screen", "name": "STEP\_CIDADE" },
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${data.situacao\_atual}",
"emergencia": "${data.emergencia}",
"pico\_glicemia": "${data.pico\_glicemia}",
"tem\_glicosimetro": "${data.tem\_glicosimetro}",
"frequencia\_controle": "${data.frequencia\_controle}",
"alimentacao": "${data.alimentacao}",
"sintomas": "${data.sintomas}",
"peso": "${data.peso}",
"altura": "${data.altura}",
"email": "${data.email}",
"idade": "${data.idade}",
"data\_nascimento": "${form.data\_nascimento}"
}
}
}
]
}
},
{
"id": "STEP\_CIDADE",
"title": "Sua Cidade (140%)",
"data": {
"controle\_glicemia": { "type": "string", "**example**": "controlado" },
"nome\_completo": { "type": "string", "**example**": "João Silva" },
"sexo": { "type": "string", "**example**": "masculino" },
"tipo\_diabetes": { "type": "string", "**example**": "tipo1" },
"anos\_diabetes": { "type": "string", "**example**": "1a3" },
"situacao\_atual": { "type": "string", "**example**": "controlado" },
"emergencia": { "type": "string", "**example**": "nao" },
"pico\_glicemia": { "type": "string", "**example**": "150_200" },
"tem\_glicosimetro": { "type": "string", "**example**": "sim" },
"frequencia\_controle": { "type": "string", "**example**": "sim\_certinho" },
"alimentacao": { "type": "string", "**example**": "controlada" },
"sintomas": { "type": "array", "items": { "type": "string" } },
"peso": { "type": "string", "**example**": "75" },
"altura": { "type": "string", "**example**": "h171" },
"email": { "type": "string", "**example**": "nome@email.com" },
"idade": { "type": "string", "**example**": "42" },
"data\_nascimento": { "type": "string", "**example**": "01/01/1985" }
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{ "type": "TextBody", "text": "Progresso: ██████████ 140%" },
{ "type": "TextBody", "text": "Qual é a sua cidade?" },
{
"type": "TextInput",
"label": "Cidade",
"name": "cidade",
"required": false,
"input-type": "text"
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": { "type": "screen", "name": "STEP\_PAIS" },
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${data.situacao\_atual}",
"emergencia": "${data.emergencia}",
"pico\_glicemia": "${data.pico\_glicemia}",
"tem\_glicosimetro": "${data.tem\_glicosimetro}",
"frequencia\_controle": "${data.frequencia\_controle}",
"alimentacao": "${data.alimentacao}",
"sintomas": "${data.sintomas}",
"peso": "${data.peso}",
"altura": "${data.altura}",
"email": "${data.email}",
"idade": "${data.idade}",
"data\_nascimento": "${data.data\_nascimento}",
"cidade": "${form.cidade}"
}
}
}
]
}
},
{
"id": "STEP\_PAIS",
"title": "Seu País (150%)",
"data": {
"controle\_glicemia": { "type": "string", "**example**": "controlado" },
"nome\_completo": { "type": "string", "**example**": "João Silva" },
"sexo": { "type": "string", "**example**": "masculino" },
"tipo\_diabetes": { "type": "string", "**example**": "tipo1" },
"anos\_diabetes": { "type": "string", "**example**": "1a3" },
"situacao\_atual": { "type": "string", "**example**": "controlado" },
"emergencia": { "type": "string", "**example**": "nao" },
"pico\_glicemia": { "type": "string", "**example**": "150_200" },
"tem\_glicosimetro": { "type": "string", "**example**": "sim" },
"frequencia\_controle": { "type": "string", "**example**": "sim\_certinho" },
"alimentacao": { "type": "string", "**example**": "controlada" },
"sintomas": { "type": "array", "items": { "type": "string" } },
"peso": { "type": "string", "**example**": "75" },
"altura": { "type": "string", "**example**": "h171" },
"email": { "type": "string", "**example**": "nome@email.com" },
"idade": { "type": "string", "**example**": "42" },
"data\_nascimento": { "type": "string", "**example**": "01/01/1985" },
"cidade": { "type": "string", "**example**": "Goiânia" }
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{ "type": "TextBody", "text": "Progresso: ██████████ 150%" },
{ "type": "TextBody", "text": "Em qual país você mora?" },
{
"type": "TextInput",
"label": "País",
"name": "pais",
"required": false,
"input-type": "text",
"helper-text": "Ex: Brasil"
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": { "type": "screen", "name": "STEP\_MEDICAMENTOS" },
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${data.situacao\_atual}",
"emergencia": "${data.emergencia}",
"pico\_glicemia": "${data.pico\_glicemia}",
"tem\_glicosimetro": "${data.tem\_glicosimetro}",
"frequencia\_controle": "${data.frequencia\_controle}",
"alimentacao": "${data.alimentacao}",
"sintomas": "${data.sintomas}",
"peso": "${data.peso}",
"altura": "${data.altura}",
"email": "${data.email}",
"idade": "${data.idade}",
"data\_nascimento": "${data.data\_nascimento}",
"cidade": "${data.cidade}",
"pais": "${form.pais}"
}
}
}
]
}
},
{
"id": "STEP\_MEDICAMENTOS",
"title": "Medicamentos (160%)",
"data": {
"controle\_glicemia": { "type": "string", "**example**": "controlado" },
"nome\_completo": { "type": "string", "**example**": "João Silva" },
"sexo": { "type": "string", "**example**": "masculino" },
"tipo\_diabetes": { "type": "string", "**example**": "tipo1" },
"anos\_diabetes": { "type": "string", "**example**": "1a3" },
"situacao\_atual": { "type": "string", "**example**": "controlado" },
"emergencia": { "type": "string", "**example**": "nao" },
"pico\_glicemia": { "type": "string", "**example**": "150_200" },
"tem\_glicosimetro": { "type": "string", "**example**": "sim" },
"frequencia\_controle": { "type": "string", "**example**": "sim\_certinho" },
"alimentacao": { "type": "string", "**example**": "controlada" },
"sintomas": { "type": "array", "items": { "type": "string" } },
"peso": { "type": "string", "**example**": "75" },
"altura": { "type": "string", "**example**": "h171" },
"email": { "type": "string", "**example**": "nome@email.com" },
"idade": { "type": "string", "**example**": "42" },
"data\_nascimento": { "type": "string", "**example**": "01/01/1985" },
"cidade": { "type": "string", "**example**": "Goiânia" },
"pais": { "type": "string", "**example**": "Brasil" }
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{ "type": "TextBody", "text": "Progresso: ██████████ 160%" },
{ "type": "TextBody", "text": "Você usa algum medicamento? (Opcional)" },
{
"type": "TextInput",
"label": "Medicamentos",
"name": "medicamentos",
"required": false,
"input-type": "text",
"helper-text": "Ex: Metformina 850mg"
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": { "type": "screen", "name": "STEP\_META\_GLICEMICA" },
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${data.situacao\_atual}",
"emergencia": "${data.emergencia}",
"pico\_glicemia": "${data.pico\_glicemia}",
"tem\_glicosimetro": "${data.tem\_glicosimetro}",
"frequencia\_controle": "${data.frequencia\_controle}",
"alimentacao": "${data.alimentacao}",
"sintomas": "${data.sintomas}",
"peso": "${data.peso}",
"altura": "${data.altura}",
"email": "${data.email}",
"idade": "${data.idade}",
"data\_nascimento": "${data.data\_nascimento}",
"cidade": "${data.cidade}",
"pais": "${data.pais}",
"medicamentos": "${form.medicamentos}"
}
}
}
]
}
},
{
"id": "STEP\_META\_GLICEMICA",
"title": "Metas de Glicemia (170%)",
"terminal": true,
"success": true,
"data": {
"controle\_glicemia": { "type": "string", "**example**": "controlado" },
"nome\_completo": { "type": "string", "**example**": "João Silva" },
"sexo": { "type": "string", "**example**": "masculino" },
"tipo\_diabetes": { "type": "string", "**example**": "tipo1" },
"anos\_diabetes": { "type": "string", "**example**": "1a3" },
"situacao\_atual": { "type": "string", "**example**": "controlado" },
"emergencia": { "type": "string", "**example**": "nao" },
"pico\_glicemia": { "type": "string", "**example**": "150_200" },
"tem\_glicosimetro": { "type": "string", "**example**": "sim" },
"frequencia\_controle": { "type": "string", "**example**": "sim\_certinho" },
"alimentacao": { "type": "string", "**example**": "controlada" },
"sintomas": { "type": "array", "items": { "type": "string" } },
"peso": { "type": "string", "**example**": "75" },
"altura": { "type": "string", "**example**": "h171" },
"email": { "type": "string", "**example**": "nome@email.com" },
"idade": { "type": "string", "**example**": "42" },
"data\_nascimento": { "type": "string", "**example**": "01/01/1985" },
"cidade": { "type": "string", "**example**": "Goiânia" },
"pais": { "type": "string", "**example**": "Brasil" },
"medicamentos": { "type": "string", "**example**": "Metformina 850mg" }
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{ "type": "TextBody", "text": "Progresso: ██████████ 170% 🎉" },
{ "type": "TextBody", "text": "Qual meta de glicemia você quer seguir?" },
{
"type": "TextInput",
"label": "Meta mínima (mg/dL)",
"name": "meta\_glicemica\_min",
"required": false,
"input-type": "number",
"helper-text": "Ex: 70"
},
{
"type": "TextInput",
"label": "Meta máxima (mg/dL)",
"name": "meta\_glicemica\_max",
"required": false,
"input-type": "number",
"helper-text": "Ex: 140"
},
{
"type": "Footer",
"label": "Ver meu plano 🧬✨",
"on-click-action": {
"name": "complete",
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${data.situacao\_atual}",
"emergencia": "${data.emergencia}",
"pico\_glicemia": "${data.pico\_glicemia}",
"tem\_glicosimetro": "${data.tem\_glicosimetro}",
"frequencia\_controle": "${data.frequencia\_controle}",
"alimentacao": "${data.alimentacao}",
"sintomas": "${data.sintomas}",
"peso": "${data.peso}",
"altura": "${data.altura}",
"email": "${data.email}",
"idade": "${data.idade}",
"data\_nascimento": "${data.data\_nascimento}",
"cidade": "${data.cidade}",
"pais": "${data.pais}",
"medicamentos": "${data.medicamentos}",
"meta\_glicemica\_min": "${form.meta\_glicemica\_min}",
"meta\_glicemica\_max": "${form.meta\_glicemica\_max}"
}
}
}
]
}
}
},
{
"id": "CONTEXT",
"title": "Meu objetivo 🎯",
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextHeading",
"text": "Meu objetivo é simples:"
},
{
"type": "TextBody",
"text": "👉 Te ajudar a evitar picos de glicemia."
},
{
"type": "TextBody",
"text": "👉 Reduzir riscos de complicações."
},
{
"type": "TextBody",
"text": "👉 Te ensinar a comer bem sem neura 🍽️"
},
{
"type": "TextBody",
"text": "Vou te fazer algumas perguntas rápidas (menos de 1 minuto ⏱️) e começo a te acompanhar de forma personalizada."
},
{
"type": "TextBody",
"text": "Vamos lá? 🚀"
},
{
"type": "Footer",
"label": "Sim, quero controlar! 💪",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "MISSION\_START"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}"
}
}
}
]
}
},
{
"id": "MISSION\_START",
"title": "Missão Iniciada 🎮",
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextHeading",
"text": "🎯 Missão: Perfil Metabólico"
},
{
"type": "TextBody",
"text": "Progresso: ░░░░░░░░░░ 0%"
},
{
"type": "TextBody",
"text": "Vamos montar seu perfil completo. Quanto mais você preencher, mais personalizado será seu acompanhamento! 🧬"
},
{
"type": "Footer",
"label": "Iniciar 📋",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "STEP\_NAME"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}"
}
}
}
]
}
},
{
"id": "STEP\_NAME",
"title": "Seu Nome (10%)",
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextBody",
"text": "Progresso: █░░░░░░░░░ 10%"
},
{
"type": "TextBody",
"text": "Qual é o seu nome e sobrenome?"
},
{
"type": "TextInput",
"label": "Nome e sobrenome",
"name": "nome\_completo",
"required": true,
"input-type": "text",
"helper-text": "Ex: João Silva"
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "STEP\_SEXO"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${form.nome\_completo}"
}
}
}
]
}
},
{
"id": "STEP\_SEXO",
"title": "Seu Sexo (20%)",
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
},
"nome\_completo": {
"type": "string",
"**example**": "João Silva"
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextBody",
"text": "Progresso: ██░░░░░░░░ 20%"
},
{
"type": "TextBody",
"text": "Qual é o seu sexo?"
},
{
"type": "RadioButtonsGroup",
"label": "Selecione uma opção:",
"name": "sexo",
"required": true,
"data-source": \[
{
"id": "masculino",
"title": "🔘 Masculino"
},
{
"id": "feminino",
"title": "🔘 Feminino"
},
{
"id": "outro",
"title": "🔘 Outro"
},
{
"id": "nao\_informar",
"title": "🔘 Prefiro não informar"
}
]
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "STEP\_DIABETES\_TYPE"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${form.sexo}"
}
}
}
]
}
},
{
"id": "STEP\_DIABETES\_TYPE",
"title": "Tipo de Diabetes (30%)",
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
},
"nome\_completo": {
"type": "string",
"**example**": "João Silva"
},
"sexo": {
"type": "string",
"**example**": "masculino"
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextBody",
"text": "Progresso: ███░░░░░░░ 30%"
},
{
"type": "TextBody",
"text": "Qual é o seu tipo de diabetes?"
},
{
"type": "RadioButtonsGroup",
"label": "Selecione uma opção:",
"name": "tipo\_diabetes",
"required": true,
"data-source": \[
{
"id": "tipo1",
"title": "🔘 Tipo 1"
},
{
"id": "tipo2",
"title": "🔘 Tipo 2"
},
{
"id": "gestacional",
"title": "🔘 Gestacional"
},
{
"id": "nao\_sei",
"title": "🔘 Não sei"
}
]
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "DIABETES\_TYPE\_CHECK"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${form.tipo\_diabetes}"
}
}
}
]
}
},
{
"id": "DIABETES\_TYPE\_CHECK",
"title": "Atenção ⚠️",
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
},
"nome\_completo": {
"type": "string",
"**example**": "João Silva"
},
"sexo": {
"type": "string",
"**example**": "masculino"
},
"tipo\_diabetes": {
"type": "string",
"**example**": "tipo1"
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextHeading",
"text": "⚠️ Atenção!"
},
{
"type": "TextBody",
"text": "O Gluco IA é focado em pessoas com diabetes tipo 1 ou tipo 2.\n\nMas fica tranquilo 😊\n\nPosso te orientar a buscar um diagnóstico correto e depois voltamos com tudo 💪\n\n(Se você selecionou Tipo 1 ou Tipo 2, pode continuar normalmente!)"
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "STEP\_TEMPO\_DIABETES"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}"
}
}
}
]
}
},
{
"id": "STEP\_TEMPO\_DIABETES",
"title": "Há quanto tempo? (35%)",
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
},
"nome\_completo": {
"type": "string",
"**example**": "João Silva"
},
"sexo": {
"type": "string",
"**example**": "masculino"
},
"tipo\_diabetes": {
"type": "string",
"**example**": "tipo1"
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextBody",
"text": "Progresso: ████░░░░░░ 35%"
},
{
"type": "TextBody",
"text": "Há quanto tempo você tem diabetes?"
},
{
"type": "RadioButtonsGroup",
"label": "Selecione uma opção:",
"name": "anos\_diabetes",
"required": true,
"data-source": \[
{
"id": "menos1",
"title": "1️⃣ Menos de 1 ano"
},
{
"id": "1a3",
"title": "2️⃣ Entre 1 e 3 anos"
},
{
"id": "3a5",
"title": "3️⃣ Entre 3 e 5 anos"
},
{
"id": "mais5",
"title": "4️⃣ Mais de 5 anos"
}
]
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "STEP\_SITUACAO"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${form.anos\_diabetes}"
}
}
}
]
}
},
{
"id": "STEP\_SITUACAO",
"title": "Situação Atual (40%)",
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
},
"nome\_completo": {
"type": "string",
"**example**": "João Silva"
},
"sexo": {
"type": "string",
"**example**": "masculino"
},
"tipo\_diabetes": {
"type": "string",
"**example**": "tipo1"
},
"anos\_diabetes": {
"type": "string",
"**example**": "1a3"
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextBody",
"text": "Progresso: █████░░░░░ 40%"
},
{
"type": "TextBody",
"text": "Hoje você considera que seu diabetes está:"
},
{
"type": "RadioButtonsGroup",
"label": "Selecione uma opção:",
"name": "situacao\_atual",
"required": true,
"data-source": \[
{
"id": "controlado",
"title": "🔘 Controlado"
},
{
"id": "descontrolado",
"title": "🔘 Descontrolado"
},
{
"id": "nao\_sei",
"title": "🔘 Não sei"
}
]
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "STEP\_EMERGENCIA"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${form.situacao\_atual}"
}
}
}
]
}
},
{
"id": "STEP\_EMERGENCIA",
"title": "Emergências (55%)",
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
},
"nome\_completo": {
"type": "string",
"**example**": "João Silva"
},
"sexo": {
"type": "string",
"**example**": "masculino"
},
"tipo\_diabetes": {
"type": "string",
"**example**": "tipo1"
},
"anos\_diabetes": {
"type": "string",
"**example**": "1a3"
},
"situacao\_atual": {
"type": "string",
"**example**": "controlado"
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextBody",
"text": "Progresso: ██████░░░░ 55%"
},
{
"type": "TextBody",
"text": "Você já precisou ir ao pronto socorro por glicemia alta?"
},
{
"type": "RadioButtonsGroup",
"label": "Selecione uma opção:",
"name": "emergencia",
"required": true,
"data-source": \[
{
"id": "sim",
"title": "🔘 Sim, já estive"
},
{
"id": "nao",
"title": "🔘 Não, nunca precisei"
}
]
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "STEP\_PICO\_GLICEMIA"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${data.situacao\_atual}",
"emergencia": "${form.emergencia}"
}
}
}
]
}
},
{
"id": "STEP\_PICO\_GLICEMIA",
"title": "Pico de Glicemia (60%)",
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
},
"nome\_completo": {
"type": "string",
"**example**": "João Silva"
},
"sexo": {
"type": "string",
"**example**": "masculino"
},
"tipo\_diabetes": {
"type": "string",
"**example**": "tipo1"
},
"anos\_diabetes": {
"type": "string",
"**example**": "1a3"
},
"situacao\_atual": {
"type": "string",
"**example**": "controlado"
},
"emergencia": {
"type": "string",
"**example**": "nao"
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextBody",
"text": "Progresso: ███████░░░ 60%"
},
{
"type": "TextBody",
"text": "Você lembra qual foi a maior glicemia que já teve?"
},
{
"type": "RadioButtonsGroup",
"label": "Selecione uma opção:",
"name": "pico\_glicemia",
"required": true,
"data-source": \[
{
"id": "ate150",
"title": "1️⃣ Até 150 mg/dl"
},
{
"id": "150\_200",
"title": "2️⃣ 150 – 200 mg/dl"
},
{
"id": "200\_300",
"title": "3️⃣ 200 – 300 mg/dl"
},
{
"id": "300\_400",
"title": "4️⃣ 300 – 400 mg/dl"
},
{
"id": "acima400",
"title": "5️⃣ Acima de 400 mg/dl"
}
]
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "STEP\_GLICOSIMETRO"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${data.situacao\_atual}",
"emergencia": "${data.emergencia}",
"pico\_glicemia": "${form.pico\_glicemia}"
}
}
}
]
}
},
{
"id": "STEP\_GLICOSIMETRO",
"title": "Aparelho de Medição (75%)",
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
},
"nome\_completo": {
"type": "string",
"**example**": "João Silva"
},
"sexo": {
"type": "string",
"**example**": "masculino"
},
"tipo\_diabetes": {
"type": "string",
"**example**": "tipo1"
},
"anos\_diabetes": {
"type": "string",
"**example**": "1a3"
},
"situacao\_atual": {
"type": "string",
"**example**": "controlado"
},
"emergencia": {
"type": "string",
"**example**": "nao"
},
"pico\_glicemia": {
"type": "string",
"**example**": "ate150"
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextBody",
"text": "Progresso: ████████░░ 75%"
},
{
"type": "TextBody",
"text": "Você tem aparelho para medir glicemia em casa?"
},
{
"type": "RadioButtonsGroup",
"label": "Selecione uma opção:",
"name": "tem\_glicosimetro",
"required": true,
"data-source": \[
{
"id": "sim",
"title": "🔘 Sim"
},
{
"id": "nao",
"title": "🔘 Não"
}
]
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "STEP\_FREQUENCIA\_CONTROLE"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${data.situacao\_atual}",
"emergencia": "${data.emergencia}",
"pico\_glicemia": "${data.pico\_glicemia}",
"tem\_glicosimetro": "${form.tem\_glicosimetro}"
}
}
}
]
}
},
{
"id": "STEP\_FREQUENCIA\_CONTROLE",
"title": "Frequência (80%)",
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
},
"nome\_completo": {
"type": "string",
"**example**": "João Silva"
},
"sexo": {
"type": "string",
"**example**": "masculino"
},
"tipo\_diabetes": {
"type": "string",
"**example**": "tipo1"
},
"anos\_diabetes": {
"type": "string",
"**example**": "1a3"
},
"situacao\_atual": {
"type": "string",
"**example**": "controlado"
},
"emergencia": {
"type": "string",
"**example**": "nao"
},
"pico\_glicemia": {
"type": "string",
"**example**": "ate150"
},
"tem\_glicosimetro": {
"type": "string",
"**example**": "sim"
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextBody",
"text": "Progresso: █████████░ 80%"
},
{
"type": "TextBody",
"text": "Você faz controle da glicemia com frequência?"
},
{
"type": "RadioButtonsGroup",
"label": "Selecione uma opção:",
"name": "frequencia\_controle",
"required": true,
"data-source": \[
{
"id": "sim\_certinho",
"title": "🔘 Sim, faço certinho"
},
{
"id": "nao\_habito",
"title": "🔘 Não tenho esse hábito"
}
]
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "TRANSITION\_ALMOST"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${data.situacao\_atual}",
"emergencia": "${data.emergencia}",
"pico\_glicemia": "${data.pico\_glicemia}",
"tem\_glicosimetro": "${data.tem\_glicosimetro}",
"frequencia\_controle": "${form.frequencia\_controle}"
}
}
}
]
}
},
{
"id": "TRANSITION\_ALMOST",
"title": "Quase lá! 🔥",
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
},
"nome\_completo": {
"type": "string",
"**example**": "João Silva"
},
"sexo": {
"type": "string",
"**example**": "masculino"
},
"tipo\_diabetes": {
"type": "string",
"**example**": "tipo1"
},
"anos\_diabetes": {
"type": "string",
"**example**": "1a3"
},
"situacao\_atual": {
"type": "string",
"**example**": "controlado"
},
"emergencia": {
"type": "string",
"**example**": "nao"
},
"pico\_glicemia": {
"type": "string",
"**example**": "ate150"
},
"tem\_glicosimetro": {
"type": "string",
"**example**": "sim"
},
"frequencia\_controle": {
"type": "string",
"**example**": "sim\_certinho"
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextHeading",
"text": "Você já chegou até aqui! 😄"
},
{
"type": "TextBody",
"text": "👉 Falta só um empurrãozinho pra eu liberar tudo personalizado pra você!"
},
{
"type": "TextBody",
"text": "São só 2 perguntinhas rápidas e já te entrego seu plano completo 🧬✨"
},
{
"type": "TextBody",
"text": "Progresso: █████████░ 90%"
},
{
"type": "TextBody",
"text": "Bora finalizar juntos? 🚀"
},
{
"type": "Footer",
"label": "Finalizar! 💪",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "STEP\_ALIMENTACAO"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${data.situacao\_atual}",
"emergencia": "${data.emergencia}",
"pico\_glicemia": "${data.pico\_glicemia}",
"tem\_glicosimetro": "${data.tem\_glicosimetro}",
"frequencia\_controle": "${data.frequencia\_controle}"
}
}
}
]
}
},
{
"id": "STEP\_ALIMENTACAO",
"title": "Alimentação (90%)",
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
},
"nome\_completo": {
"type": "string",
"**example**": "João Silva"
},
"sexo": {
"type": "string",
"**example**": "masculino"
},
"tipo\_diabetes": {
"type": "string",
"**example**": "tipo1"
},
"anos\_diabetes": {
"type": "string",
"**example**": "1a3"
},
"situacao\_atual": {
"type": "string",
"**example**": "controlado"
},
"emergencia": {
"type": "string",
"**example**": "nao"
},
"pico\_glicemia": {
"type": "string",
"**example**": "ate150"
},
"tem\_glicosimetro": {
"type": "string",
"**example**": "sim"
},
"frequencia\_controle": {
"type": "string",
"**example**": "sim\_certinho"
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextBody",
"text": "Progresso: █████████░ 90%"
},
{
"type": "TextBody",
"text": "Isso aqui é OURO 👇\n\nAgora me conta com sinceridade 😄\n\nComo está sua alimentação no dia a dia?"
},
{
"type": "RadioButtonsGroup",
"label": "Selecione uma opção:",
"name": "alimentacao",
"required": true,
"data-source": \[
{
"id": "controlada",
"title": "1️⃣ Bem controlada"
},
{
"id": "mais\_ou\_menos",
"title": "2️⃣ Mais ou menos"
},
{
"id": "como\_tudo",
"title": "3️⃣ Como de tudo 😅"
},
{
"id": "desorganizada",
"title": "4️⃣ Muito desorganizada"
}
]
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "STEP\_SINTOMAS"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${data.situacao\_atual}",
"emergencia": "${data.emergencia}",
"pico\_glicemia": "${data.pico\_glicemia}",
"tem\_glicosimetro": "${data.tem\_glicosimetro}",
"frequencia\_controle": "${data.frequencia\_controle}",
"alimentacao": "${form.alimentacao}"
}
}
}
]
}
},
{
"id": "STEP\_SINTOMAS",
"title": "Seus Sintomas (95%)",
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
},
"nome\_completo": {
"type": "string",
"**example**": "João Silva"
},
"sexo": {
"type": "string",
"**example**": "masculino"
},
"tipo\_diabetes": {
"type": "string",
"**example**": "tipo1"
},
"anos\_diabetes": {
"type": "string",
"**example**": "1a3"
},
"situacao\_atual": {
"type": "string",
"**example**": "controlado"
},
"emergencia": {
"type": "string",
"**example**": "nao"
},
"pico\_glicemia": {
"type": "string",
"**example**": "ate150"
},
"tem\_glicosimetro": {
"type": "string",
"**example**": "sim"
},
"frequencia\_controle": {
"type": "string",
"**example**": "sim\_certinho"
},
"alimentacao": {
"type": "string",
"**example**": "controlada"
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextBody",
"text": "Progresso: █████████░ 95%"
},
{
"type": "TextBody",
"text": "Você tem percebido algum sinal no seu corpo? 👀\n\nAlguns podem indicar que a glicemia já está impactando o organismo por dentro 👇\n\nPode marcar mais de uma opção 😉"
},
{
"type": "CheckboxGroup",
"label": "Marque os que se aplicam:",
"name": "sintomas",
"required": true,
"data-source": \[
{
"id": "nenhum",
"title": "1️⃣ Nenhum"
},
{
"id": "energia",
"title": "2️⃣ Perda de energia"
},
{
"id": "visao",
"title": "3️⃣ Visão turva"
},
{
"id": "falta\_ar",
"title": "4️⃣ Falta de ar"
},
{
"id": "inchaco",
"title": "5️⃣ Inchaço nas pernas"
},
{
"id": "pressao",
"title": "6️⃣ Pressão elevada"
},
{
"id": "urina",
"title": "7️⃣ Urina espumosa"
},
{
"id": "dores",
"title": "8️⃣ Dores ou câimbras"
},
{
"id": "cabelo",
"title": "9️⃣ Queda de cabelo"
}
]
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "STEP\_PESO"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${data.situacao\_atual}",
"emergencia": "${data.emergencia}",
"pico\_glicemia": "${data.pico\_glicemia}",
"tem\_glicosimetro": "${data.tem\_glicosimetro}",
"frequencia\_controle": "${data.frequencia\_controle}",
"alimentacao": "${data.alimentacao}",
"sintomas": "${form.sintomas}"
}
}
}
]
}
},
{
"id": "STEP\_PESO",
"title": "Seu Peso (97%)",
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
},
"nome\_completo": {
"type": "string",
"**example**": "João Silva"
},
"sexo": {
"type": "string",
"**example**": "masculino"
},
"tipo\_diabetes": {
"type": "string",
"**example**": "tipo1"
},
"anos\_diabetes": {
"type": "string",
"**example**": "1a3"
},
"situacao\_atual": {
"type": "string",
"**example**": "controlado"
},
"emergencia": {
"type": "string",
"**example**": "nao"
},
"pico\_glicemia": {
"type": "string",
"**example**": "ate150"
},
"tem\_glicosimetro": {
"type": "string",
"**example**": "sim"
},
"frequencia\_controle": {
"type": "string",
"**example**": "sim\_certinho"
},
"alimentacao": {
"type": "string",
"**example**": "controlada"
},
"sintomas": {
"type": "array",
"items": {
"type": "string"
},
"**example**": \[
"nenhum"
]
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextBody",
"text": "Progresso: █████████░ 97%"
},
{
"type": "TextBody",
"text": "Qual é o seu peso atual?"
},
{
"type": "Dropdown",
"label": "Selecione seu peso",
"name": "peso",
"required": true,
"data-source": \[
{
"id": "p40",
"title": "40 kg"
},
{
"id": "p41",
"title": "41 kg"
},
{
"id": "p42",
"title": "42 kg"
},
{
"id": "p43",
"title": "43 kg"
},
{
"id": "p44",
"title": "44 kg"
},
{
"id": "p45",
"title": "45 kg"
},
{
"id": "p46",
"title": "46 kg"
},
{
"id": "p47",
"title": "47 kg"
},
{
"id": "p48",
"title": "48 kg"
},
{
"id": "p49",
"title": "49 kg"
},
{
"id": "p50",
"title": "50 kg"
},
{
"id": "p51",
"title": "51 kg"
},
{
"id": "p52",
"title": "52 kg"
},
{
"id": "p53",
"title": "53 kg"
},
{
"id": "p54",
"title": "54 kg"
},
{
"id": "p55",
"title": "55 kg"
},
{
"id": "p56",
"title": "56 kg"
},
{
"id": "p57",
"title": "57 kg"
},
{
"id": "p58",
"title": "58 kg"
},
{
"id": "p59",
"title": "59 kg"
},
{
"id": "p60",
"title": "60 kg"
},
{
"id": "p61",
"title": "61 kg"
},
{
"id": "p62",
"title": "62 kg"
},
{
"id": "p63",
"title": "63 kg"
},
{
"id": "p64",
"title": "64 kg"
},
{
"id": "p65",
"title": "65 kg"
},
{
"id": "p66",
"title": "66 kg"
},
{
"id": "p67",
"title": "67 kg"
},
{
"id": "p68",
"title": "68 kg"
},
{
"id": "p69",
"title": "69 kg"
},
{
"id": "p70",
"title": "70 kg"
},
{
"id": "p71",
"title": "71 kg"
},
{
"id": "p72",
"title": "72 kg"
},
{
"id": "p73",
"title": "73 kg"
},
{
"id": "p74",
"title": "74 kg"
},
{
"id": "p75",
"title": "75 kg"
},
{
"id": "p76",
"title": "76 kg"
},
{
"id": "p77",
"title": "77 kg"
},
{
"id": "p78",
"title": "78 kg"
},
{
"id": "p79",
"title": "79 kg"
},
{
"id": "p80",
"title": "80 kg"
},
{
"id": "p81",
"title": "81 kg"
},
{
"id": "p82",
"title": "82 kg"
},
{
"id": "p83",
"title": "83 kg"
},
{
"id": "p84",
"title": "84 kg"
},
{
"id": "p85",
"title": "85 kg"
},
{
"id": "p86",
"title": "86 kg"
},
{
"id": "p87",
"title": "87 kg"
},
{
"id": "p88",
"title": "88 kg"
},
{
"id": "p89",
"title": "89 kg"
},
{
"id": "p90",
"title": "90 kg"
},
{
"id": "p91",
"title": "91 kg"
},
{
"id": "p92",
"title": "92 kg"
},
{
"id": "p93",
"title": "93 kg"
},
{
"id": "p94",
"title": "94 kg"
},
{
"id": "p95",
"title": "95 kg"
},
{
"id": "p96",
"title": "96 kg"
},
{
"id": "p97",
"title": "97 kg"
},
{
"id": "p98",
"title": "98 kg"
},
{
"id": "p99",
"title": "99 kg"
},
{
"id": "p100",
"title": "100 kg"
},
{
"id": "p101",
"title": "101 kg"
},
{
"id": "p102",
"title": "102 kg"
},
{
"id": "p103",
"title": "103 kg"
},
{
"id": "p104",
"title": "104 kg"
},
{
"id": "p105",
"title": "105 kg"
},
{
"id": "p106",
"title": "106 kg"
},
{
"id": "p107",
"title": "107 kg"
},
{
"id": "p108",
"title": "108 kg"
},
{
"id": "p109",
"title": "109 kg"
},
{
"id": "p110",
"title": "110 kg"
},
{
"id": "p111",
"title": "111 kg"
},
{
"id": "p112",
"title": "112 kg"
},
{
"id": "p113",
"title": "113 kg"
},
{
"id": "p114",
"title": "114 kg"
},
{
"id": "p115",
"title": "115 kg"
},
{
"id": "p116",
"title": "116 kg"
},
{
"id": "p117",
"title": "117 kg"
},
{
"id": "p118",
"title": "118 kg"
},
{
"id": "p119",
"title": "119 kg"
},
{
"id": "p120",
"title": "120 kg"
},
{
"id": "p121",
"title": "121 kg"
},
{
"id": "p122",
"title": "122 kg"
},
{
"id": "p123",
"title": "123 kg"
},
{
"id": "p124",
"title": "124 kg"
},
{
"id": "p125",
"title": "125 kg"
},
{
"id": "p126",
"title": "126 kg"
},
{
"id": "p127",
"title": "127 kg"
},
{
"id": "p128",
"title": "128 kg"
},
{
"id": "p129",
"title": "129 kg"
},
{
"id": "p130",
"title": "130 kg"
},
{
"id": "p131",
"title": "131 kg"
},
{
"id": "p132",
"title": "132 kg"
},
{
"id": "p133",
"title": "133 kg"
},
{
"id": "p134",
"title": "134 kg"
},
{
"id": "p135",
"title": "135 kg"
},
{
"id": "p136",
"title": "136 kg"
},
{
"id": "p137",
"title": "137 kg"
},
{
"id": "p138",
"title": "138 kg"
},
{
"id": "p139",
"title": "139 kg"
},
{
"id": "p140",
"title": "140 kg"
},
{
"id": "p141",
"title": "141 kg"
},
{
"id": "p142",
"title": "142 kg"
},
{
"id": "p143",
"title": "143 kg"
},
{
"id": "p144",
"title": "144 kg"
},
{
"id": "p145",
"title": "145 kg"
},
{
"id": "p146",
"title": "146 kg"
},
{
"id": "p147",
"title": "147 kg"
},
{
"id": "p148",
"title": "148 kg"
},
{
"id": "p149",
"title": "149 kg"
},
{
"id": "p150",
"title": "150 kg"
},
{
"id": "p151",
"title": "151 kg"
},
{
"id": "p152",
"title": "152 kg"
},
{
"id": "p153",
"title": "153 kg"
},
{
"id": "p154",
"title": "154 kg"
},
{
"id": "p155",
"title": "155 kg"
},
{
"id": "p156",
"title": "156 kg"
},
{
"id": "p157",
"title": "157 kg"
},
{
"id": "p158",
"title": "158 kg"
},
{
"id": "p159",
"title": "159 kg"
},
{
"id": "p160",
"title": "160 kg"
},
{
"id": "p161",
"title": "161 kg"
},
{
"id": "p162",
"title": "162 kg"
},
{
"id": "p163",
"title": "163 kg"
},
{
"id": "p164",
"title": "164 kg"
},
{
"id": "p165",
"title": "165 kg"
},
{
"id": "p166",
"title": "166 kg"
},
{
"id": "p167",
"title": "167 kg"
},
{
"id": "p168",
"title": "168 kg"
},
{
"id": "p169",
"title": "169 kg"
},
{
"id": "p170",
"title": "170 kg"
},
{
"id": "p171",
"title": "171 kg"
},
{
"id": "p172",
"title": "172 kg"
},
{
"id": "p173",
"title": "173 kg"
},
{
"id": "p174",
"title": "174 kg"
},
{
"id": "p175",
"title": "175 kg"
},
{
"id": "p176",
"title": "176 kg"
},
{
"id": "p177",
"title": "177 kg"
},
{
"id": "p178",
"title": "178 kg"
},
{
"id": "p179",
"title": "179 kg"
},
{
"id": "p180",
"title": "180 kg"
}
]
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "STEP\_ALTURA"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${data.situacao\_atual}",
"emergencia": "${data.emergencia}",
"pico\_glicemia": "${data.pico\_glicemia}",
"tem\_glicosimetro": "${data.tem\_glicosimetro}",
"frequencia\_controle": "${data.frequencia\_controle}",
"alimentacao": "${data.alimentacao}",
"sintomas": "${data.sintomas}",
"peso": "${form.peso}"
}
}
}
]
}
},
{
"id": "STEP\_ALTURA",
"title": "Sua Altura (100%)",
"terminal": false,
"success": false,
"data": {
"controle\_glicemia": {
"type": "string",
"**example**": "controlado"
},
"nome\_completo": {
"type": "string",
"**example**": "João Silva"
},
"sexo": {
"type": "string",
"**example**": "masculino"
},
"tipo\_diabetes": {
"type": "string",
"**example**": "tipo1"
},
"anos\_diabetes": {
"type": "string",
"**example**": "1a3"
},
"situacao\_atual": {
"type": "string",
"**example**": "controlado"
},
"emergencia": {
"type": "string",
"**example**": "nao"
},
"pico\_glicemia": {
"type": "string",
"**example**": "ate150"
},
"tem\_glicosimetro": {
"type": "string",
"**example**": "sim"
},
"frequencia\_controle": {
"type": "string",
"**example**": "sim\_certinho"
},
"alimentacao": {
"type": "string",
"**example**": "controlada"
},
"sintomas": {
"type": "array",
"items": {
"type": "string"
},
"**example**": \[
"nenhum"
]
},
"peso": {
"type": "string",
"**example**": "75"
}
},
"layout": {
"type": "SingleColumnLayout",
"children": \[
{
"type": "TextBody",
"text": "Progresso: ██████████ 100% 🎉"
},
{
"type": "TextBody",
"text": "Qual é a sua altura?"
},
{
"type": "Dropdown",
"label": "Selecione sua altura",
"name": "altura",
"required": true,
"data-source": \[
{
"id": "h131",
"title": "131 cm"
},
{
"id": "h132",
"title": "132 cm"
},
{
"id": "h133",
"title": "133 cm"
},
{
"id": "h134",
"title": "134 cm"
},
{
"id": "h135",
"title": "135 cm"
},
{
"id": "h136",
"title": "136 cm"
},
{
"id": "h137",
"title": "137 cm"
},
{
"id": "h138",
"title": "138 cm"
},
{
"id": "h139",
"title": "139 cm"
},
{
"id": "h140",
"title": "140 cm"
},
{
"id": "h141",
"title": "141 cm"
},
{
"id": "h142",
"title": "142 cm"
},
{
"id": "h143",
"title": "143 cm"
},
{
"id": "h144",
"title": "144 cm"
},
{
"id": "h145",
"title": "145 cm"
},
{
"id": "h146",
"title": "146 cm"
},
{
"id": "h147",
"title": "147 cm"
},
{
"id": "h148",
"title": "148 cm"
},
{
"id": "h149",
"title": "149 cm"
},
{
"id": "h150",
"title": "150 cm"
},
{
"id": "h151",
"title": "151 cm"
},
{
"id": "h152",
"title": "152 cm"
},
{
"id": "h153",
"title": "153 cm"
},
{
"id": "h154",
"title": "154 cm"
},
{
"id": "h155",
"title": "155 cm"
},
{
"id": "h156",
"title": "156 cm"
},
{
"id": "h157",
"title": "157 cm"
},
{
"id": "h158",
"title": "158 cm"
},
{
"id": "h159",
"title": "159 cm"
},
{
"id": "h160",
"title": "160 cm"
},
{
"id": "h161",
"title": "161 cm"
},
{
"id": "h162",
"title": "162 cm"
},
{
"id": "h163",
"title": "163 cm"
},
{
"id": "h164",
"title": "164 cm"
},
{
"id": "h165",
"title": "165 cm"
},
{
"id": "h166",
"title": "166 cm"
},
{
"id": "h167",
"title": "167 cm"
},
{
"id": "h168",
"title": "168 cm"
},
{
"id": "h169",
"title": "169 cm"
},
{
"id": "h170",
"title": "170 cm"
},
{
"id": "h171",
"title": "171 cm"
},
{
"id": "h172",
"title": "172 cm"
},
{
"id": "h173",
"title": "173 cm"
},
{
"id": "h174",
"title": "174 cm"
},
{
"id": "h175",
"title": "175 cm"
},
{
"id": "h176",
"title": "176 cm"
},
{
"id": "h177",
"title": "177 cm"
},
{
"id": "h178",
"title": "178 cm"
},
{
"id": "h179",
"title": "179 cm"
},
{
"id": "h180",
"title": "180 cm"
},
{
"id": "h181",
"title": "181 cm"
},
{
"id": "h182",
"title": "182 cm"
},
{
"id": "h183",
"title": "183 cm"
},
{
"id": "h184",
"title": "184 cm"
},
{
"id": "h185",
"title": "185 cm"
},
{
"id": "h186",
"title": "186 cm"
},
{
"id": "h187",
"title": "187 cm"
},
{
"id": "h188",
"title": "188 cm"
},
{
"id": "h189",
"title": "189 cm"
},
{
"id": "h190",
"title": "190 cm"
},
{
"id": "h191",
"title": "191 cm"
},
{
"id": "h192",
"title": "192 cm"
},
{
"id": "h193",
"title": "193 cm"
},
{
"id": "h194",
"title": "194 cm"
},
{
"id": "h195",
"title": "195 cm"
},
{
"id": "h196",
"title": "196 cm"
},
{
"id": "h197",
"title": "197 cm"
},
{
"id": "h198",
"title": "198 cm"
},
{
"id": "h199",
"title": "199 cm"
},
{
"id": "h200",
"title": "200 cm"
},
{
"id": "h201",
"title": "201 cm"
},
{
"id": "h202",
"title": "202 cm"
},
{
"id": "h203",
"title": "203 cm"
},
{
"id": "h204",
"title": "204 cm"
},
{
"id": "h205",
"title": "205 cm"
},
{
"id": "h206",
"title": "206 cm"
},
{
"id": "h207",
"title": "207 cm"
},
{
"id": "h208",
"title": "208 cm"
},
{
"id": "h209",
"title": "209 cm"
},
{
"id": "h210",
"title": "210 cm"
}
]
},
{
"type": "Footer",
"label": "Continuar",
"on-click-action": {
"name": "navigate",
"next": {
"type": "screen",
"name": "STEP\_EMAIL"
},
"payload": {
"controle\_glicemia": "${data.controle\_glicemia}",
"nome\_completo": "${data.nome\_completo}",
"sexo": "${data.sexo}",
"tipo\_diabetes": "${data.tipo\_diabetes}",
"anos\_diabetes": "${data.anos\_diabetes}",
"situacao\_atual": "${data.situacao\_atual}",
"emergencia": "${data.emergencia}",
"pico\_glicemia": "${data.pico\_glicemia}",
"tem\_glicosimetro": "${data.tem\_glicosimetro}",
"frequencia\_controle": "${data.frequencia\_controle}",
"alimentacao": "${data.alimentacao}",
"sintomas": "${data.sintomas}",
"peso": "${data.peso}",
"altura": "${form.altura}"
}
}
}
]
}
}
]
}
