{
  "version": "7.3",
  "screens": [
    {
      "id": "BREAK_PATTERN",
      "title": "Uma pergunta rápida 😄",
      "data": {},
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          { "type": "TextHeading", "text": "Antes da gente começar…" },
          {
            "type": "TextBody",
            "text": "Deixa eu te perguntar uma coisa 😄\n(Sem julgamentos… estamos juntos nisso 🤝)"
          },
          { "type": "TextBody", "text": "👉 Você é do tipo que:" },
          {
            "type": "Form",
            "name": "form_break_pattern",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Escolha uma opção:",
                "name": "controle_glicemia",
                "required": true,
                "data-source": [
                  { "id": "controlado", "title": "1️⃣ Controla direitinho" },
                  { "id": "descuidado", "title": "2️⃣ Lembra quando dá problema" }
                ]
              },
              {
                "type": "Footer",
                "label": "Continuar",
                "on-click-action": {
                  "name": "navigate",
                  "next": { "type": "screen", "name": "MISSION_START" },
                  "payload": {
                    "controle_glicemia": "${form.controle_glicemia}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "MISSION_START",
      "title": "Missão Iniciada 🎮",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          { "type": "TextHeading", "text": "🎯 Missão: Perfil Metabólico" },
          { "type": "TextBody", "text": "Progresso: ░░░░░░░░░░ 0%" },
          {
            "type": "TextBody",
            "text": "Vamos montar seu perfil completo. Quanto mais você preencher, mais personalizado será seu acompanhamento! 🧬"
          },
          {
            "type": "Form",
            "name": "form_mission_start",
            "children": [
              {
                "type": "Footer",
                "label": "Iniciar 📋",
                "on-click-action": {
                  "name": "navigate",
                  "next": { "type": "screen", "name": "STEP_NAME" },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_NAME",
      "title": "Seu Nome (10%)",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          { "type": "TextBody", "text": "Progresso: █░░░░░░░░░ 10%" },
          { "type": "TextBody", "text": "Qual é o seu nome e sobrenome?" },
          {
            "type": "Form",
            "name": "form_step_name",
            "children": [
              {
                "type": "TextInput",
                "label": "Nome e sobrenome",
                "name": "nome_completo",
                "required": true,
                "input-type": "text",
                "helper-text": "Ex: João Silva"
              },
              {
                "type": "Footer",
                "label": "Continuar",
                "on-click-action": {
                  "name": "navigate",
                  "next": { "type": "screen", "name": "STEP_NASCIMENTO" },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${form.nome_completo}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_NASCIMENTO",
      "title": "Data de Nascimento (20%)",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          { "type": "TextBody", "text": "Progresso: ██░░░░░░░░ 20%" },
          { "type": "TextBody", "text": "Qual é a sua data de nascimento?" },
          {
            "type": "Form",
            "name": "form_step_nascimento",
            "children": [
              {
                "type": "DatePicker",
                "label": "Data de nascimento",
                "name": "data_nascimento",
                "required": true,
                "helper-text": "Selecione sua data de nascimento"
              },
              {
                "type": "Footer",
                "label": "Continuar",
                "on-click-action": {
                  "name": "navigate",
                  "next": { "type": "screen", "name": "STEP_SEXO" },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "data_nascimento": "${form.data_nascimento}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_SEXO",
      "title": "Seu Sexo (30%)",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          { "type": "TextBody", "text": "Progresso: ███░░░░░░░ 30%" },
          { "type": "TextBody", "text": "Qual é o seu sexo?" },
          {
            "type": "Form",
            "name": "form_step_sexo",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Selecione uma opção:",
                "name": "sexo",
                "required": true,
                "data-source": [
                  { "id": "masculino", "title": "🔘 Masculino" },
                  { "id": "feminino", "title": "🔘 Feminino" },
                  { "id": "outro", "title": "🔘 Outro" },
                  { "id": "nao_informar", "title": "🔘 Prefiro não informar" }
                ]
              },
              {
                "type": "Footer",
                "label": "Continuar",
                "on-click-action": {
                  "name": "navigate",
                  "next": { "type": "screen", "name": "STEP_PAIS" },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "data_nascimento": "${data.data_nascimento}",
                    "sexo": "${form.sexo}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_PAIS",
      "title": "Seu País (40%)",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          { "type": "TextBody", "text": "Progresso: ████░░░░░░ 40%" },
          { "type": "TextBody", "text": "Em qual país você mora?" },
          {
            "type": "Form",
            "name": "form_step_pais",
            "children": [
              {
                "type": "TextInput",
                "label": "País",
                "name": "pais",
                "required": true,
                "input-type": "text",
                "helper-text": "Ex: Brasil"
              },
              {
                "type": "Footer",
                "label": "Continuar",
                "on-click-action": {
                  "name": "navigate",
                  "next": { "type": "screen", "name": "STEP_DIABETES_TYPE" },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "data_nascimento": "${data.data_nascimento}",
                    "sexo": "${data.sexo}",
                    "pais": "${form.pais}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_DIABETES_TYPE",
      "title": "Tipo de Diabetes (50%)",
      "terminal": true,
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          { "type": "TextBody", "text": "Progresso: █████░░░░░ 50%" },
          { "type": "TextBody", "text": "Qual é o seu tipo de diabetes?" },
          {
            "type": "Form",
            "name": "form_step_diabetes_type",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Selecione uma opção:",
                "name": "tipo_diabetes",
                "required": true,
                "data-source": [
                  { "id": "tipo1", "title": "🔘 Tipo 1" },
                  { "id": "tipo2", "title": "🔘 Tipo 2" },
                  { "id": "gestacional", "title": "🔘 Gestacional" },
                  { "id": "nao_sei", "title": "🔘 Não sei" }
                ]
              },
              {
                "type": "Footer",
                "label": "Finalizar",
                "on-click-action": {
                  "name": "complete",
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "data_nascimento": "${data.data_nascimento}",
                    "sexo": "${data.sexo}",
                    "pais": "${data.pais}",
                    "tipo_diabetes": "${form.tipo_diabetes}"
                  }
                }
              }
            ]
          }
        ]
      }
    }
  ]
}