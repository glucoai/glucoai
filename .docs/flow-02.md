{
  "version": "7.3",
  "screens": [
    {
      "id": "DIABETES_TYPE_CHECK",
      "title": "Agora Vamos Continuar ✅",
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
          "__example__": "2000-01-01"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextHeading",
            "text": "🧬 Tudo Pronto!"
          },
          {
            "type": "TextBody",
            "text": "Parabéns, você se classifica no grupo atendido pelo Gluco AI, que é focado em pessoas com diabetes tipo 1 ou tipo 2."
          },
          {
            "type": "TextBody",
            "text": "Agora basta tocar no botão Continuar, para que possamos prosseguir com o seu cadastro"
          },
          {
            "type": "Form",
            "name": "form_diabetes_check",
            "children": [
              {
                "type": "Footer",
                "label": "Continuar",
                "on-click-action": {
                  "name": "navigate",
                  "next": {
                    "type": "screen",
                    "name": "STEP_MEDICAMENTOS"
                  },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "data_nascimento": "${data.data_nascimento}",
                    "sexo": "${data.sexo}",
                    "pais": "${data.pais}",
                    "tipo_diabetes": "${data.tipo_diabetes}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_MEDICAMENTOS",
      "title": "Medicamentos",
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
          "__example__": "2000-01-01"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "Form",
            "name": "form_step_medicamentos",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Você usa alguma medicação para diabetes atualmente?",
                "name": "medicamentos",
                "required": true,
                "data-source": [
                  { "id": "insulina", "title": "Insulina" },
                  { "id": "metformina", "title": "Metformina ou outro comprimido" },
                  { "id": "insulinamais", "title": "Insulina + comprimidos" },
                  { "id": "naousa", "title": "Não uso medicação" },
                  { "id": "naosabedizer", "title": "Não sei / Prefiro não dizer" }
                ]
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
                    "data_nascimento": "${data.data_nascimento}",
                    "sexo": "${data.sexo}",
                    "pais": "${data.pais}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "medicamentos": "${form.medicamentos}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_TEMPO_DIABETES",
      "title": "Tempo com Diabetes",
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
          "__example__": "2000-01-01"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "medicamentos": {
          "type": "string",
          "__example__": "insulina"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "Form",
            "name": "form_step_tempo",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Há quanto tempo você tem diabetes?",
                "name": "anos_diabetes",
                "required": true,
                "data-source": [
                  { "id": "menos1", "title": "Menos de 1 ano" },
                  { "id": "1a3", "title": "1 a 3 anos" },
                  { "id": "3a5", "title": "3 a 5 anos" },
                  { "id": "5a10", "title": "5 a 10 anos" },
                  { "id": "mais10", "title": "Mais de 10 anos" }
                ]
              },
              {
                "type": "Footer",
                "label": "Continuar",
                "on-click-action": {
                  "name": "navigate",
                  "next": {
                    "type": "screen",
                    "name": "STEP_CONTROLE_DIABETES"
                  },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "data_nascimento": "${data.data_nascimento}",
                    "sexo": "${data.sexo}",
                    "pais": "${data.pais}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "medicamentos": "${data.medicamentos}",
                    "anos_diabetes": "${form.anos_diabetes}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_CONTROLE_DIABETES",
      "title": "Controle do Diabetes",
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
          "__example__": "2000-01-01"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "medicamentos": {
          "type": "string",
          "__example__": "insulina"
        },
        "anos_diabetes": {
          "type": "string",
          "__example__": "1a3"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "Form",
            "name": "form_controle_diabetes",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Hoje você considera que seu diabetes está:",
                "name": "controle_diabetes",
                "required": true,
                "data-source": [
                  { "id": "controlado", "title": "🟢 Controlado" },
                  { "id": "descontrolado", "title": "🔴 Descontrolado" },
                  { "id": "nao_sei", "title": "🤔 Não sei" }
                ]
              },
              {
                "type": "Footer",
                "label": "Continuar",
                "on-click-action": {
                  "name": "navigate",
                  "next": {
                    "type": "screen",
                    "name": "STEP_PRONTO_SOCORRO"
                  },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "data_nascimento": "${data.data_nascimento}",
                    "sexo": "${data.sexo}",
                    "pais": "${data.pais}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "medicamentos": "${data.medicamentos}",
                    "anos_diabetes": "${data.anos_diabetes}",
                    "controle_diabetes": "${form.controle_diabetes}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_PRONTO_SOCORRO",
      "title": "Emergências",
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
          "__example__": "2000-01-01"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "medicamentos": {
          "type": "string",
          "__example__": "insulina"
        },
        "anos_diabetes": {
          "type": "string",
          "__example__": "1a3"
        },
        "controle_diabetes": {
          "type": "string",
          "__example__": "controlado"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "Form",
            "name": "form_pronto_socorro",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Você já precisou ir ao pronto-socorro por glicemia alta?",
                "name": "pronto_socorro",
                "required": true,
                "data-source": [
                  { "id": "sim", "title": "Sim, já precisei" },
                  { "id": "nao", "title": "Não, nunca precisei" }
                ]
              },
              {
                "type": "Footer",
                "label": "Continuar",
                "on-click-action": {
                  "name": "navigate",
                  "next": {
                    "type": "screen",
                    "name": "STEP_MAIOR_GLICEMIA"
                  },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "data_nascimento": "${data.data_nascimento}",
                    "sexo": "${data.sexo}",
                    "pais": "${data.pais}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "medicamentos": "${data.medicamentos}",
                    "anos_diabetes": "${data.anos_diabetes}",
                    "controle_diabetes": "${data.controle_diabetes}",
                    "pronto_socorro": "${form.pronto_socorro}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_MAIOR_GLICEMIA",
      "title": "Maior Glicemia",
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
          "__example__": "2000-01-01"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "medicamentos": {
          "type": "string",
          "__example__": "insulina"
        },
        "anos_diabetes": {
          "type": "string",
          "__example__": "1a3"
        },
        "controle_diabetes": {
          "type": "string",
          "__example__": "controlado"
        },
        "pronto_socorro": {
          "type": "string",
          "__example__": "nao"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "Form",
            "name": "form_maior_glicemia",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Você lembra qual foi a maior glicemia que já teve?",
                "name": "maior_glicemia",
                "required": true,
                "data-source": [
                  { "id": "ate150", "title": "Até 150 mg/dL" },
                  { "id": "150_200", "title": "150 a 200 mg/dL" },
                  { "id": "200_300", "title": "200 a 300 mg/dL" },
                  { "id": "300_400", "title": "300 a 400 mg/dL" },
                  { "id": "acima400", "title": "Acima de 400 mg/dL" }
                ]
              },
              {
                "type": "Footer",
                "label": "Continuar",
                "on-click-action": {
                  "name": "navigate",
                  "next": {
                    "type": "screen",
                    "name": "STEP_APARELHO_GLICEMIA"
                  },
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "data_nascimento": "${data.data_nascimento}",
                    "sexo": "${data.sexo}",
                    "pais": "${data.pais}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "medicamentos": "${data.medicamentos}",
                    "anos_diabetes": "${data.anos_diabetes}",
                    "controle_diabetes": "${data.controle_diabetes}",
                    "pronto_socorro": "${data.pronto_socorro}",
                    "maior_glicemia": "${form.maior_glicemia}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_APARELHO_GLICEMIA",
      "title": "Aparelho de Glicemia",
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
          "__example__": "2000-01-01"
        },
        "sexo": {
          "type": "string",
          "__example__": "masculino"
        },
        "pais": {
          "type": "string",
          "__example__": "Brasil"
        },
        "tipo_diabetes": {
          "type": "string",
          "__example__": "tipo1"
        },
        "medicamentos": {
          "type": "string",
          "__example__": "insulina"
        },
        "anos_diabetes": {
          "type": "string",
          "__example__": "1a3"
        },
        "controle_diabetes": {
          "type": "string",
          "__example__": "controlado"
        },
        "pronto_socorro": {
          "type": "string",
          "__example__": "nao"
        },
        "maior_glicemia": {
          "type": "string",
          "__example__": "150_200"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "Form",
            "name": "form_aparelho_glicemia",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Você tem aparelho para medir glicemia em casa?",
                "name": "aparelho_glicemia",
                "required": true,
                "data-source": [
                  { "id": "sim", "title": "Sim" },
                  { "id": "nao", "title": "Não" }
                ]
              },
              {
                "type": "Footer",
                "label": "Enviar",
                "on-click-action": {
                  "name": "complete",
                  "payload": {
                    "controle_glicemia": "${data.controle_glicemia}",
                    "nome_completo": "${data.nome_completo}",
                    "data_nascimento": "${data.data_nascimento}",
                    "sexo": "${data.sexo}",
                    "pais": "${data.pais}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "medicamentos": "${data.medicamentos}",
                    "anos_diabetes": "${data.anos_diabetes}",
                    "controle_diabetes": "${data.controle_diabetes}",
                    "pronto_socorro": "${data.pronto_socorro}",
                    "maior_glicemia": "${data.maior_glicemia}",
                    "aparelho_glicemia": "${form.aparelho_glicemia}"
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
