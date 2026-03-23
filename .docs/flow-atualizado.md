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
            "type": "Form",
            "name": "form_break_pattern",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Escolha uma opção:",
                "name": "controle_glicemia",
                "required": true,
                "data-source": [
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
      "id": "CONTEXT",
      "title": "Meu objetivo 🎯",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
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
                "name": "MISSION_START"
              },
              "payload": {
                "controle_glicemia": "${data.controle_glicemia}"
              }
            }
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
                "name": "STEP_NAME"
              },
              "payload": {
                "controle_glicemia": "${data.controle_glicemia}"
              }
            }
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
          {
            "type": "TextBody",
            "text": "Progresso: █░░░░░░░░░ 10%"
          },
          {
            "type": "TextBody",
            "text": "Qual é o seu nome e sobrenome?"
          },
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
                  "next": {
                    "type": "screen",
                    "name": "STEP_NASCIMENTO"
                  },
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
      "title": "Data de Nascimento (15%)",
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
          {
            "type": "TextBody",
            "text": "Progresso: █░░░░░░░░░ 15%"
          },
          {
            "type": "TextBody",
            "text": "Qual é a sua data de nascimento?"
          },
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
                  "next": {
                    "type": "screen",
                    "name": "STEP_SEXO"
                  },
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
      "title": "Seu Sexo (20%)",
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
          {
            "type": "TextBody",
            "text": "Progresso: ██░░░░░░░░ 20%"
          },
          {
            "type": "TextBody",
            "text": "Qual é o seu sexo?"
          },
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
                    "id": "nao_informar",
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
                    "name": "STEP_PAIS"
                  },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "sexo": "${form.sexo}",
                    "data_nascimento": "${data.data_nascimento}"
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
      "title": "Seu País (25%)",
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
          {
            "type": "TextBody",
            "text": "Progresso: ██░░░░░░░░ 25%"
          },
          {
            "type": "TextBody",
            "text": "Em qual país você mora?"
          },
          {
            "type": "Form",
            "name": "form_step_pais",
            "children": [
              {
                "type": "TextInput",
                "label": "País de residência",
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
                  "next": {
                    "type": "screen",
                    "name": "STEP_DIABETES_TYPE"
                  },
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
      "title": "Tipo de Diabetes (30%)",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextBody",
            "text": "Progresso: ███░░░░░░░ 30%"
          },
          {
            "type": "TextBody",
            "text": "Qual é o seu tipo de diabetes?"
          },
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
                    "id": "nao_sei",
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
                    "name": "DIABETES_TYPE_CHECK"
                  },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "sexo": "${data.sexo}",
                    "tipo_diabetes": "${form.tipo_diabetes}",
                    "data_nascimento": "${data.data_nascimento}",
                    "pais": "${data.pais}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "DIABETES_TYPE_CHECK",
      "title": "Atenção ⚠️",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
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
                "name": "STEP_TEMPO_DIABETES"
              },
              "payload": {
                "controle_glicemia": "${data.controle_glicemia}",
                "nome_completo": "${data.nome_completo}",
                "sexo": "${data.sexo}",
                "tipo_diabetes": "${data.tipo_diabetes}",
                "data_nascimento": "${data.data_nascimento}",
                "pais": "${data.pais}"
              }
            }
          }
        ]
      }
    },
    {
      "id": "STEP_TEMPO_DIABETES",
      "title": "Há quanto tempo? (35%)",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextBody",
            "text": "Progresso: ████░░░░░░ 35%"
          },
          {
            "type": "TextBody",
            "text": "Há quanto tempo você tem diabetes?"
          },
          {
            "type": "Form",
            "name": "form_step_tempo_diabetes",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Selecione uma opção:",
                "name": "anos_diabetes",
                "required": true,
                "data-source": [
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
                    "name": "STEP_SITUACAO"
                  },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "sexo": "${data.sexo}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "anos_diabetes": "${form.anos_diabetes}",
                    "data_nascimento": "${data.data_nascimento}",
                    "pais": "${data.pais}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_SITUACAO",
      "title": "Situação Atual (40%)",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "anos_diabetes": {
          "type": "string",
          "__example__": "1a3"
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextBody",
            "text": "Progresso: █████░░░░░ 40%"
          },
          {
            "type": "TextBody",
            "text": "Hoje você considera que seu diabetes está:"
          },
          {
            "type": "Form",
            "name": "form_step_situacao",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Selecione uma opção:",
                "name": "situacao_atual",
                "required": true,
                "data-source": [
                  {
                    "id": "controlado",
                    "title": "🔘 Controlado"
                  },
                  {
                    "id": "descontrolado",
                    "title": "🔘 Descontrolado"
                  },
                  {
                    "id": "nao_sei",
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
                    "name": "STEP_EMERGENCIA"
                  },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "sexo": "${data.sexo}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "anos_diabetes": "${data.anos_diabetes}",
                    "situacao_atual": "${form.situacao_atual}",
                    "data_nascimento": "${data.data_nascimento}",
                    "pais": "${data.pais}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_EMERGENCIA",
      "title": "Emergências (55%)",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "anos_diabetes": {
          "type": "string",
          "__example__": "1a3"
        },
        "situacao_atual": {
          "type": "string",
          "__example__": "controlado"
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextBody",
            "text": "Progresso: ██████░░░░ 55%"
          },
          {
            "type": "TextBody",
            "text": "Você já precisou ir ao pronto socorro por glicemia alta?"
          },
          {
            "type": "Form",
            "name": "form_step_emergencia",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Selecione uma opção:",
                "name": "emergencia",
                "required": true,
                "data-source": [
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
                    "name": "STEP_PICO_GLICEMIA"
                  },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "sexo": "${data.sexo}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "anos_diabetes": "${data.anos_diabetes}",
                    "situacao_atual": "${data.situacao_atual}",
                    "emergencia": "${form.emergencia}",
                    "data_nascimento": "${data.data_nascimento}",
                    "pais": "${data.pais}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_PICO_GLICEMIA",
      "title": "Pico de Glicemia (60%)",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "anos_diabetes": {
          "type": "string",
          "__example__": "1a3"
        },
        "situacao_atual": {
          "type": "string",
          "__example__": "controlado"
        },
        "emergencia": {
          "type": "string",
          "__example__": "nao"
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextBody",
            "text": "Progresso: ███████░░░ 60%"
          },
          {
            "type": "TextBody",
            "text": "Você lembra qual foi a maior glicemia que já teve?"
          },
          {
            "type": "Form",
            "name": "form_step_pico_glicemia",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Selecione uma opção:",
                "name": "pico_glicemia",
                "required": true,
                "data-source": [
                  {
                    "id": "ate150",
                    "title": "1️⃣ Até 150 mg/dl"
                  },
                  {
                    "id": "150_200",
                    "title": "2️⃣ 150 – 200 mg/dl"
                  },
                  {
                    "id": "200_300",
                    "title": "3️⃣ 200 – 300 mg/dl"
                  },
                  {
                    "id": "300_400",
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
                    "name": "STEP_GLICOSIMETRO"
                  },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "sexo": "${data.sexo}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "anos_diabetes": "${data.anos_diabetes}",
                    "situacao_atual": "${data.situacao_atual}",
                    "emergencia": "${data.emergencia}",
                    "pico_glicemia": "${form.pico_glicemia}",
                    "data_nascimento": "${data.data_nascimento}",
                    "pais": "${data.pais}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_GLICOSIMETRO",
      "title": "Aparelho de Medição (75%)",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "anos_diabetes": {
          "type": "string",
          "__example__": "1a3"
        },
        "situacao_atual": {
          "type": "string",
          "__example__": "controlado"
        },
        "emergencia": {
          "type": "string",
          "__example__": "nao"
        },
        "pico_glicemia": {
          "type": "string",
          "__example__": "ate150"
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextBody",
            "text": "Progresso: ████████░░ 75%"
          },
          {
            "type": "TextBody",
            "text": "Você tem aparelho para medir glicemia em casa?"
          },
          {
            "type": "Form",
            "name": "form_step_glicosimetro",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Selecione uma opção:",
                "name": "tem_glicosimetro",
                "required": true,
                "data-source": [
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
                    "name": "STEP_FREQUENCIA_CONTROLE"
                  },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "sexo": "${data.sexo}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "anos_diabetes": "${data.anos_diabetes}",
                    "situacao_atual": "${data.situacao_atual}",
                    "emergencia": "${data.emergencia}",
                    "pico_glicemia": "${data.pico_glicemia}",
                    "tem_glicosimetro": "${form.tem_glicosimetro}",
                    "data_nascimento": "${data.data_nascimento}",
                    "pais": "${data.pais}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_FREQUENCIA_CONTROLE",
      "title": "Frequência (80%)",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "anos_diabetes": {
          "type": "string",
          "__example__": "1a3"
        },
        "situacao_atual": {
          "type": "string",
          "__example__": "controlado"
        },
        "emergencia": {
          "type": "string",
          "__example__": "nao"
        },
        "pico_glicemia": {
          "type": "string",
          "__example__": "ate150"
        },
        "tem_glicosimetro": {
          "type": "string",
          "__example__": "sim"
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextBody",
            "text": "Progresso: █████████░ 80%"
          },
          {
            "type": "TextBody",
            "text": "Você faz controle da glicemia com frequência?"
          },
          {
            "type": "Form",
            "name": "form_step_frequencia_controle",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Selecione uma opção:",
                "name": "frequencia_controle",
                "required": true,
                "data-source": [
                  {
                    "id": "sim_certinho",
                    "title": "🔘 Sim, faço certinho"
                  },
                  {
                    "id": "nao_habito",
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
                    "name": "TRANSITION_ALMOST"
                  },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "sexo": "${data.sexo}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "anos_diabetes": "${data.anos_diabetes}",
                    "situacao_atual": "${data.situacao_atual}",
                    "emergencia": "${data.emergencia}",
                    "pico_glicemia": "${data.pico_glicemia}",
                    "tem_glicosimetro": "${data.tem_glicosimetro}",
                    "frequencia_controle": "${form.frequencia_controle}",
                    "data_nascimento": "${data.data_nascimento}",
                    "pais": "${data.pais}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "TRANSITION_ALMOST",
      "title": "Quase lá! 🔥",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "anos_diabetes": {
          "type": "string",
          "__example__": "1a3"
        },
        "situacao_atual": {
          "type": "string",
          "__example__": "controlado"
        },
        "emergencia": {
          "type": "string",
          "__example__": "nao"
        },
        "pico_glicemia": {
          "type": "string",
          "__example__": "ate150"
        },
        "tem_glicosimetro": {
          "type": "string",
          "__example__": "sim"
        },
        "frequencia_controle": {
          "type": "string",
          "__example__": "sim_certinho"
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
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
                "name": "STEP_ALIMENTACAO"
              },
              "payload": {
                "controle_glicemia": "${data.controle_glicemia}",
                "nome_completo": "${data.nome_completo}",
                "sexo": "${data.sexo}",
                "tipo_diabetes": "${data.tipo_diabetes}",
                "anos_diabetes": "${data.anos_diabetes}",
                "situacao_atual": "${data.situacao_atual}",
                "emergencia": "${data.emergencia}",
                "pico_glicemia": "${data.pico_glicemia}",
                "tem_glicosimetro": "${data.tem_glicosimetro}",
                "frequencia_controle": "${data.frequencia_controle}",
                "data_nascimento": "${data.data_nascimento}",
                "pais": "${data.pais}"
              }
            }
          }
        ]
      }
    },
    {
      "id": "STEP_ALIMENTACAO",
      "title": "Alimentação (90%)",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "anos_diabetes": {
          "type": "string",
          "__example__": "1a3"
        },
        "situacao_atual": {
          "type": "string",
          "__example__": "controlado"
        },
        "emergencia": {
          "type": "string",
          "__example__": "nao"
        },
        "pico_glicemia": {
          "type": "string",
          "__example__": "ate150"
        },
        "tem_glicosimetro": {
          "type": "string",
          "__example__": "sim"
        },
        "frequencia_controle": {
          "type": "string",
          "__example__": "sim_certinho"
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextBody",
            "text": "Progresso: █████████░ 90%"
          },
          {
            "type": "TextBody",
            "text": "Isso aqui é OURO 👇\n\nAgora me conta com sinceridade 😄\n\nComo está sua alimentação no dia a dia?"
          },
          {
            "type": "Form",
            "name": "form_step_alimentacao",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Selecione uma opção:",
                "name": "alimentacao",
                "required": true,
                "data-source": [
                  {
                    "id": "controlada",
                    "title": "1️⃣ Bem controlada"
                  },
                  {
                    "id": "mais_ou_menos",
                    "title": "2️⃣ Mais ou menos"
                  },
                  {
                    "id": "como_tudo",
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
                    "name": "STEP_SINTOMAS"
                  },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "sexo": "${data.sexo}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "anos_diabetes": "${data.anos_diabetes}",
                    "situacao_atual": "${data.situacao_atual}",
                    "emergencia": "${data.emergencia}",
                    "pico_glicemia": "${data.pico_glicemia}",
                    "tem_glicosimetro": "${data.tem_glicosimetro}",
                    "frequencia_controle": "${data.frequencia_controle}",
                    "alimentacao": "${form.alimentacao}",
                    "data_nascimento": "${data.data_nascimento}",
                    "pais": "${data.pais}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_SINTOMAS",
      "title": "Seus Sintomas (95%)",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "anos_diabetes": {
          "type": "string",
          "__example__": "1a3"
        },
        "situacao_atual": {
          "type": "string",
          "__example__": "controlado"
        },
        "emergencia": {
          "type": "string",
          "__example__": "nao"
        },
        "pico_glicemia": {
          "type": "string",
          "__example__": "ate150"
        },
        "tem_glicosimetro": {
          "type": "string",
          "__example__": "sim"
        },
        "frequencia_controle": {
          "type": "string",
          "__example__": "sim_certinho"
        },
        "alimentacao": {
          "type": "string",
          "__example__": "controlada"
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextBody",
            "text": "Progresso: █████████░ 95%"
          },
          {
            "type": "TextBody",
            "text": "Você tem percebido algum sinal no seu corpo? 👀\n\nAlguns podem indicar que a glicemia já está impactando o organismo por dentro 👇\n\nPode marcar mais de uma opção 😉"
          },
          {
            "type": "Form",
            "name": "form_step_sintomas",
            "children": [
              {
                "type": "CheckboxGroup",
                "label": "Marque os que se aplicam:",
                "name": "sintomas",
                "required": true,
                "data-source": [
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
                    "id": "falta_ar",
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
                    "name": "STEP_PESO"
                  },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "sexo": "${data.sexo}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "anos_diabetes": "${data.anos_diabetes}",
                    "situacao_atual": "${data.situacao_atual}",
                    "emergencia": "${data.emergencia}",
                    "pico_glicemia": "${data.pico_glicemia}",
                    "tem_glicosimetro": "${data.tem_glicosimetro}",
                    "frequencia_controle": "${data.frequencia_controle}",
                    "alimentacao": "${data.alimentacao}",
                    "sintomas": "${form.sintomas}",
                    "data_nascimento": "${data.data_nascimento}",
                    "pais": "${data.pais}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_PESO",
      "title": "Seu Peso (97%)",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "anos_diabetes": {
          "type": "string",
          "__example__": "1a3"
        },
        "situacao_atual": {
          "type": "string",
          "__example__": "controlado"
        },
        "emergencia": {
          "type": "string",
          "__example__": "nao"
        },
        "pico_glicemia": {
          "type": "string",
          "__example__": "ate150"
        },
        "tem_glicosimetro": {
          "type": "string",
          "__example__": "sim"
        },
        "frequencia_controle": {
          "type": "string",
          "__example__": "sim_certinho"
        },
        "alimentacao": {
          "type": "string",
          "__example__": "controlada"
        },
        "sintomas": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "__example__": [
            "nenhum"
          ]
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextBody",
            "text": "Progresso: █████████░ 97%"
          },
          {
            "type": "TextBody",
            "text": "Qual é o seu peso atual?"
          },
          {
            "type": "Form",
            "name": "form_step_peso",
            "children": [
              {
                "type": "Dropdown",
                "label": "Selecione seu peso",
                "name": "peso",
                "required": true,
                "data-source": [
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
                    "name": "STEP_ALTURA"
                  },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "sexo": "${data.sexo}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "anos_diabetes": "${data.anos_diabetes}",
                    "situacao_atual": "${data.situacao_atual}",
                    "emergencia": "${data.emergencia}",
                    "pico_glicemia": "${data.pico_glicemia}",
                    "tem_glicosimetro": "${data.tem_glicosimetro}",
                    "frequencia_controle": "${data.frequencia_controle}",
                    "alimentacao": "${data.alimentacao}",
                    "sintomas": "${data.sintomas}",
                    "peso": "${form.peso}",
                    "data_nascimento": "${data.data_nascimento}",
                    "pais": "${data.pais}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_ALTURA",
      "title": "Sua Altura (100%)",
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "anos_diabetes": {
          "type": "string",
          "__example__": "1a3"
        },
        "situacao_atual": {
          "type": "string",
          "__example__": "controlado"
        },
        "emergencia": {
          "type": "string",
          "__example__": "nao"
        },
        "pico_glicemia": {
          "type": "string",
          "__example__": "ate150"
        },
        "tem_glicosimetro": {
          "type": "string",
          "__example__": "sim"
        },
        "frequencia_controle": {
          "type": "string",
          "__example__": "sim_certinho"
        },
        "alimentacao": {
          "type": "string",
          "__example__": "controlada"
        },
        "sintomas": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "__example__": [
            "nenhum"
          ]
        },
        "peso": {
          "type": "string",
          "__example__": "75"
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextBody",
            "text": "Progresso: ██████████ 100% 🎉"
          },
          {
            "type": "TextBody",
            "text": "Qual é a sua altura?"
          },
          {
            "type": "Form",
            "name": "form_step_altura",
            "children": [
              {
                "type": "Dropdown",
                "label": "Selecione sua altura",
                "name": "altura",
                "required": true,
                "data-source": [
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
                "label": "Ver meu plano 🧬✨",
                "on-click-action": {
                  "name": "navigate",
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "sexo": "${data.sexo}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "anos_diabetes": "${data.anos_diabetes}",
                    "situacao_atual": "${data.situacao_atual}",
                    "emergencia": "${data.emergencia}",
                    "pico_glicemia": "${data.pico_glicemia}",
                    "tem_glicosimetro": "${data.tem_glicosimetro}",
                    "frequencia_controle": "${data.frequencia_controle}",
                    "alimentacao": "${data.alimentacao}",
                    "sintomas": "${data.sintomas}",
                    "peso": "${data.peso}",
                    "altura": "${form.altura}",
                    "data_nascimento": "${data.data_nascimento}",
                    "pais": "${data.pais}"
                  },
                  "next": {
                    "type": "screen",
                    "name": "STEP_EMAIL"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_EMAIL",
      "title": "Quase lá! Email (100%)",
      "terminal": true,
      "success": true,
      "data": {
        "controle_glicemia": {
          "type": "string",
          "__example__": "controlado"
        },
        "nome_completo": {
          "type": "string",
          "__example__": "João Silva"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "anos_diabetes": {
          "type": "string",
          "__example__": "1a3"
        },
        "situacao_atual": {
          "type": "string",
          "__example__": "controlado"
        },
        "emergencia": {
          "type": "string",
          "__example__": "nao"
        },
        "pico_glicemia": {
          "type": "string",
          "__example__": "ate150"
        },
        "tem_glicosimetro": {
          "type": "string",
          "__example__": "sim"
        },
        "frequencia_controle": {
          "type": "string",
          "__example__": "sim_certinho"
        },
        "alimentacao": {
          "type": "string",
          "__example__": "controlada"
        },
        "sintomas": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "__example__": [
            "nenhum"
          ]
        },
        "peso": {
          "type": "string",
          "__example__": "75"
        },
        "data_nascimento": {
          "type": "string",
          "__example__": "2000-01-15"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        },
        "altura": {
          "type": "string",
          "__example__": "h170"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextBody",
            "text": "Progresso: ██████████ 100% 🎉"
          },
          {
            "type": "TextHeading",
            "text": "Só mais uma coisa! 📧"
          },
          {
            "type": "TextBody",
            "text": "Agora para finalizarmos, só preciso que me informe seu melhor email, assim podemos enviar seu relatório em formato de arquivo."
          },
          {
            "type": "Form",
            "name": "form_step_email",
            "children": [
              {
                "type": "TextInput",
                "label": "Seu melhor email",
                "name": "email",
                "required": true,
                "input-type": "email",
                "helper-text": "Ex: joao@gmail.com"
              },
              {
                "type": "Footer",
                "label": "Concluir e ver meu plano 🧬✨",
                "on-click-action": {
                  "name": "complete",
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "sexo": "${data.sexo}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "anos_diabetes": "${data.anos_diabetes}",
                    "situacao_atual": "${data.situacao_atual}",
                    "emergencia": "${data.emergencia}",
                    "pico_glicemia": "${data.pico_glicemia}",
                    "tem_glicosimetro": "${data.tem_glicosimetro}",
                    "frequencia_controle": "${data.frequencia_controle}",
                    "alimentacao": "${data.alimentacao}",
                    "sintomas": "${data.sintomas}",
                    "peso": "${data.peso}",
                    "data_nascimento": "${data.data_nascimento}",
                    "pais": "${data.pais}",
                    "altura": "${data.altura}",
                    "email": "${form.email}"
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