{
  "version": "7.3",
  "screens": [
    {
      "id": "STEP_SINTOMAS",
      "title": "Sinais no Corpo",
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
        },
        "aparelho_glicemia": {
          "type": "string",
          "__example__": "sim"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "Form",
            "name": "form_step_sintomas",
            "children": [
              {
                "type": "CheckboxGroup",
                "label": "Você tem percebido algum desses sinais no seu corpo? Pode marcar mais de uma opção:",
                "name": "sintomas",
                "required": true,
                "data-source": [
                  { "id": "nenhum", "title": "Não, nenhum desses" },
                  { "id": "energia", "title": "Perda de energia e disposição" },
                  { "id": "visao", "title": "Visão turva ou embaçada" },
                  { "id": "falta_ar", "title": "Falta de ar" },
                  { "id": "inchaco", "title": "Inchaço nas pernas ou olhos" },
                  { "id": "pressao", "title": "Pressão arterial elevada" },
                  { "id": "urina_espumosa", "title": "Urina espumosa" },
                  { "id": "dores_pernas", "title": "Dores ou cãibras nas pernas" },
                  { "id": "queda_cabelo", "title": "Queda de cabelo" }
                ]
              },
              {
                "type": "Footer",
                "label": "Continuar",
                "on-click-action": {
                  "name": "navigate",
                  "next": {
                    "type": "screen",
                    "name": "STEP_ALIMENTACAO"
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
                    "maior_glicemia": "${data.maior_glicemia}",
                    "aparelho_glicemia": "${data.aparelho_glicemia}",
                    "sintomas": "${form.sintomas}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_ALIMENTACAO",
      "title": "Alimentação",
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
        },
        "aparelho_glicemia": {
          "type": "string",
          "__example__": "sim"
        },
        "sintomas": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "__example__": ["energia", "visao"]
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "Form",
            "name": "form_alimentacao",
            "children": [
              {
                "type": "RadioButtonsGroup",
                "label": "Como está sua alimentação no dia a dia?",
                "name": "alimentacao",
                "required": true,
                "data-source": [
                  { "id": "bem_controlada", "title": "Bem controlada" },
                  { "id": "mais_ou_menos", "title": "Mais ou menos" },
                  { "id": "como_de_tudo", "title": "Como de tudo" },
                  { "id": "muito_desorganizada", "title": "Muito desorganizada" }
                ]
              },
              {
                "type": "Footer",
                "label": "Continuar",
                "on-click-action": {
                  "name": "navigate",
                  "next": {
                    "type": "screen",
                    "name": "STEP_MOTIVACAO"
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
                    "maior_glicemia": "${data.maior_glicemia}",
                    "aparelho_glicemia": "${data.aparelho_glicemia}",
                    "sintomas": "${data.sintomas}",
                    "alimentacao": "${form.alimentacao}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_MOTIVACAO",
      "title": "Quase lá! 🎯",
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
        },
        "aparelho_glicemia": {
          "type": "string",
          "__example__": "sim"
        },
        "sintomas": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "__example__": ["energia", "visao"]
        },
        "alimentacao": {
          "type": "string",
          "__example__": "mais_ou_menos"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextHeading",
            "text": "Você já chegou até aqui…"
          },
          {
            "type": "TextBody",
            "text": "Falta só um empurrãozinho para eu liberar tudo personalizado para você."
          },
          {
            "type": "TextBody",
            "text": "Prometo: são só 2 perguntinhas rápidas e já te entrego seu plano completo!"
          },
          {
            "type": "Form",
            "name": "form_motivacao",
            "children": [
              {
                "type": "Footer",
                "label": "Quero Finalizar",
                "on-click-action": {
                  "name": "navigate",
                  "next": {
                    "type": "screen",
                    "name": "STEP_PESO"
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
                    "maior_glicemia": "${data.maior_glicemia}",
                    "aparelho_glicemia": "${data.aparelho_glicemia}",
                    "sintomas": "${data.sintomas}",
                    "alimentacao": "${data.alimentacao}"
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
      "title": "Seu Peso",
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
        },
        "aparelho_glicemia": {
          "type": "string",
          "__example__": "sim"
        },
        "sintomas": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "__example__": ["energia", "visao"]
        },
        "alimentacao": {
          "type": "string",
          "__example__": "mais_ou_menos"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "Form",
            "name": "form_step_peso",
            "children": [
              {
                "type": "Dropdown",
                "label": "Qual é o seu peso?",
                "name": "peso",
                "required": true,
                "data-source": [
                  { "id": "p35", "title": "35 kg" },
                  { "id": "p36", "title": "36 kg" },
                  { "id": "p37", "title": "37 kg" },
                  { "id": "p38", "title": "38 kg" },
                  { "id": "p39", "title": "39 kg" },
                  { "id": "p40", "title": "40 kg" },
                  { "id": "p41", "title": "41 kg" },
                  { "id": "p42", "title": "42 kg" },
                  { "id": "p43", "title": "43 kg" },
                  { "id": "p44", "title": "44 kg" },
                  { "id": "p45", "title": "45 kg" },
                  { "id": "p46", "title": "46 kg" },
                  { "id": "p47", "title": "47 kg" },
                  { "id": "p48", "title": "48 kg" },
                  { "id": "p49", "title": "49 kg" },
                  { "id": "p50", "title": "50 kg" },
                  { "id": "p51", "title": "51 kg" },
                  { "id": "p52", "title": "52 kg" },
                  { "id": "p53", "title": "53 kg" },
                  { "id": "p54", "title": "54 kg" },
                  { "id": "p55", "title": "55 kg" },
                  { "id": "p56", "title": "56 kg" },
                  { "id": "p57", "title": "57 kg" },
                  { "id": "p58", "title": "58 kg" },
                  { "id": "p59", "title": "59 kg" },
                  { "id": "p60", "title": "60 kg" },
                  { "id": "p61", "title": "61 kg" },
                  { "id": "p62", "title": "62 kg" },
                  { "id": "p63", "title": "63 kg" },
                  { "id": "p64", "title": "64 kg" },
                  { "id": "p65", "title": "65 kg" },
                  { "id": "p66", "title": "66 kg" },
                  { "id": "p67", "title": "67 kg" },
                  { "id": "p68", "title": "68 kg" },
                  { "id": "p69", "title": "69 kg" },
                  { "id": "p70", "title": "70 kg" },
                  { "id": "p71", "title": "71 kg" },
                  { "id": "p72", "title": "72 kg" },
                  { "id": "p73", "title": "73 kg" },
                  { "id": "p74", "title": "74 kg" },
                  { "id": "p75", "title": "75 kg" },
                  { "id": "p76", "title": "76 kg" },
                  { "id": "p77", "title": "77 kg" },
                  { "id": "p78", "title": "78 kg" },
                  { "id": "p79", "title": "79 kg" },
                  { "id": "p80", "title": "80 kg" },
                  { "id": "p81", "title": "81 kg" },
                  { "id": "p82", "title": "82 kg" },
                  { "id": "p83", "title": "83 kg" },
                  { "id": "p84", "title": "84 kg" },
                  { "id": "p85", "title": "85 kg" },
                  { "id": "p86", "title": "86 kg" },
                  { "id": "p87", "title": "87 kg" },
                  { "id": "p88", "title": "88 kg" },
                  { "id": "p89", "title": "89 kg" },
                  { "id": "p90", "title": "90 kg" },
                  { "id": "p91", "title": "91 kg" },
                  { "id": "p92", "title": "92 kg" },
                  { "id": "p93", "title": "93 kg" },
                  { "id": "p94", "title": "94 kg" },
                  { "id": "p95", "title": "95 kg" },
                  { "id": "p96", "title": "96 kg" },
                  { "id": "p97", "title": "97 kg" },
                  { "id": "p98", "title": "98 kg" },
                  { "id": "p99", "title": "99 kg" },
                  { "id": "p100", "title": "100 kg" },
                  { "id": "p101", "title": "101 kg" },
                  { "id": "p102", "title": "102 kg" },
                  { "id": "p103", "title": "103 kg" },
                  { "id": "p104", "title": "104 kg" },
                  { "id": "p105", "title": "105 kg" },
                  { "id": "p106", "title": "106 kg" },
                  { "id": "p107", "title": "107 kg" },
                  { "id": "p108", "title": "108 kg" },
                  { "id": "p109", "title": "109 kg" },
                  { "id": "p110", "title": "110 kg" },
                  { "id": "p111", "title": "111 kg" },
                  { "id": "p112", "title": "112 kg" },
                  { "id": "p113", "title": "113 kg" },
                  { "id": "p114", "title": "114 kg" },
                  { "id": "p115", "title": "115 kg" },
                  { "id": "p116", "title": "116 kg" },
                  { "id": "p117", "title": "117 kg" },
                  { "id": "p118", "title": "118 kg" },
                  { "id": "p119", "title": "119 kg" },
                  { "id": "p120", "title": "120 kg" },
                  { "id": "p121", "title": "121 kg" },
                  { "id": "p122", "title": "122 kg" },
                  { "id": "p123", "title": "123 kg" },
                  { "id": "p124", "title": "124 kg" },
                  { "id": "p125", "title": "125 kg" },
                  { "id": "p126", "title": "126 kg" },
                  { "id": "p127", "title": "127 kg" },
                  { "id": "p128", "title": "128 kg" },
                  { "id": "p129", "title": "129 kg" },
                  { "id": "p130", "title": "130 kg" },
                  { "id": "p131", "title": "131 kg" },
                  { "id": "p132", "title": "132 kg" },
                  { "id": "p133", "title": "133 kg" },
                  { "id": "p134", "title": "134 kg" },
                  { "id": "p135", "title": "135 kg" },
                  { "id": "p136", "title": "136 kg" },
                  { "id": "p137", "title": "137 kg" },
                  { "id": "p138", "title": "138 kg" },
                  { "id": "p139", "title": "139 kg" },
                  { "id": "p140", "title": "140 kg" },
                  { "id": "p141", "title": "141 kg" },
                  { "id": "p142", "title": "142 kg" },
                  { "id": "p143", "title": "143 kg" },
                  { "id": "p144", "title": "144 kg" },
                  { "id": "p145", "title": "145 kg" },
                  { "id": "p146", "title": "146 kg" },
                  { "id": "p147", "title": "147 kg" },
                  { "id": "p148", "title": "148 kg" },
                  { "id": "p149", "title": "149 kg" },
                  { "id": "p150", "title": "150 kg" },
                  { "id": "p151", "title": "151 kg" },
                  { "id": "p152", "title": "152 kg" },
                  { "id": "p153", "title": "153 kg" },
                  { "id": "p154", "title": "154 kg" },
                  { "id": "p155", "title": "155 kg" },
                  { "id": "p156", "title": "156 kg" },
                  { "id": "p157", "title": "157 kg" },
                  { "id": "p158", "title": "158 kg" },
                  { "id": "p159", "title": "159 kg" },
                  { "id": "p160", "title": "160 kg" },
                  { "id": "p161", "title": "161 kg" },
                  { "id": "p162", "title": "162 kg" },
                  { "id": "p163", "title": "163 kg" },
                  { "id": "p164", "title": "164 kg" },
                  { "id": "p165", "title": "165 kg" },
                  { "id": "p166", "title": "166 kg" },
                  { "id": "p167", "title": "167 kg" },
                  { "id": "p168", "title": "168 kg" },
                  { "id": "p169", "title": "169 kg" },
                  { "id": "p170", "title": "170 kg" },
                  { "id": "p171", "title": "171 kg" },
                  { "id": "p172", "title": "172 kg" },
                  { "id": "p173", "title": "173 kg" },
                  { "id": "p174", "title": "174 kg" },
                  { "id": "p175", "title": "175 kg" },
                  { "id": "p176", "title": "176 kg" },
                  { "id": "p177", "title": "177 kg" },
                  { "id": "p178", "title": "178 kg" },
                  { "id": "p179", "title": "179 kg" },
                  { "id": "p180", "title": "180 kg" },
                  { "id": "p181", "title": "181 kg" },
                  { "id": "p182", "title": "182 kg" },
                  { "id": "p183", "title": "183 kg" },
                  { "id": "p184", "title": "184 kg" },
                  { "id": "p185", "title": "185 kg" },
                  { "id": "p186", "title": "186 kg" },
                  { "id": "p187", "title": "187 kg" },
                  { "id": "p188", "title": "188 kg" },
                  { "id": "p189", "title": "189 kg" },
                  { "id": "p190", "title": "190 kg" },
                  { "id": "p191", "title": "191 kg" },
                  { "id": "p192", "title": "192 kg" },
                  { "id": "p193", "title": "193 kg" },
                  { "id": "p194", "title": "194 kg" },
                  { "id": "p195", "title": "195 kg" },
                  { "id": "p196", "title": "196 kg" },
                  { "id": "p197", "title": "197 kg" },
                  { "id": "p198", "title": "198 kg" },
                  { "id": "p199", "title": "199 kg" },
                  { "id": "p200", "title": "200 kg" }
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
                    "data_nascimento": "${data.data_nascimento}",
                    "sexo": "${data.sexo}",
                    "pais": "${data.pais}",
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "medicamentos": "${data.medicamentos}",
                    "anos_diabetes": "${data.anos_diabetes}",
                    "controle_diabetes": "${data.controle_diabetes}",
                    "pronto_socorro": "${data.pronto_socorro}",
                    "maior_glicemia": "${data.maior_glicemia}",
                    "aparelho_glicemia": "${data.aparelho_glicemia}",
                    "sintomas": "${data.sintomas}",
                    "alimentacao": "${data.alimentacao}",
                    "peso": "${form.peso}"
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
      "title": "Sua Altura",
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
        },
        "aparelho_glicemia": {
          "type": "string",
          "__example__": "sim"
        },
        "sintomas": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "__example__": ["energia", "visao"]
        },
        "alimentacao": {
          "type": "string",
          "__example__": "mais_ou_menos"
        },
        "peso": {
          "type": "string",
          "__example__": "p70"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "Form",
            "name": "form_step_altura",
            "children": [
              {
                "type": "Dropdown",
                "label": "Qual é a sua altura?",
                "name": "altura",
                "required": true,
                "data-source": [
                  { "id": "h130", "title": "130 cm" },
                  { "id": "h131", "title": "131 cm" },
                  { "id": "h132", "title": "132 cm" },
                  { "id": "h133", "title": "133 cm" },
                  { "id": "h134", "title": "134 cm" },
                  { "id": "h135", "title": "135 cm" },
                  { "id": "h136", "title": "136 cm" },
                  { "id": "h137", "title": "137 cm" },
                  { "id": "h138", "title": "138 cm" },
                  { "id": "h139", "title": "139 cm" },
                  { "id": "h140", "title": "140 cm" },
                  { "id": "h141", "title": "141 cm" },
                  { "id": "h142", "title": "142 cm" },
                  { "id": "h143", "title": "143 cm" },
                  { "id": "h144", "title": "144 cm" },
                  { "id": "h145", "title": "145 cm" },
                  { "id": "h146", "title": "146 cm" },
                  { "id": "h147", "title": "147 cm" },
                  { "id": "h148", "title": "148 cm" },
                  { "id": "h149", "title": "149 cm" },
                  { "id": "h150", "title": "150 cm" },
                  { "id": "h151", "title": "151 cm" },
                  { "id": "h152", "title": "152 cm" },
                  { "id": "h153", "title": "153 cm" },
                  { "id": "h154", "title": "154 cm" },
                  { "id": "h155", "title": "155 cm" },
                  { "id": "h156", "title": "156 cm" },
                  { "id": "h157", "title": "157 cm" },
                  { "id": "h158", "title": "158 cm" },
                  { "id": "h159", "title": "159 cm" },
                  { "id": "h160", "title": "160 cm" },
                  { "id": "h161", "title": "161 cm" },
                  { "id": "h162", "title": "162 cm" },
                  { "id": "h163", "title": "163 cm" },
                  { "id": "h164", "title": "164 cm" },
                  { "id": "h165", "title": "165 cm" },
                  { "id": "h166", "title": "166 cm" },
                  { "id": "h167", "title": "167 cm" },
                  { "id": "h168", "title": "168 cm" },
                  { "id": "h169", "title": "169 cm" },
                  { "id": "h170", "title": "170 cm" },
                  { "id": "h171", "title": "171 cm" },
                  { "id": "h172", "title": "172 cm" },
                  { "id": "h173", "title": "173 cm" },
                  { "id": "h174", "title": "174 cm" },
                  { "id": "h175", "title": "175 cm" },
                  { "id": "h176", "title": "176 cm" },
                  { "id": "h177", "title": "177 cm" },
                  { "id": "h178", "title": "178 cm" },
                  { "id": "h179", "title": "179 cm" },
                  { "id": "h180", "title": "180 cm" },
                  { "id": "h181", "title": "181 cm" },
                  { "id": "h182", "title": "182 cm" },
                  { "id": "h183", "title": "183 cm" },
                  { "id": "h184", "title": "184 cm" },
                  { "id": "h185", "title": "185 cm" },
                  { "id": "h186", "title": "186 cm" },
                  { "id": "h187", "title": "187 cm" },
                  { "id": "h188", "title": "188 cm" },
                  { "id": "h189", "title": "189 cm" },
                  { "id": "h190", "title": "190 cm" },
                  { "id": "h191", "title": "191 cm" },
                  { "id": "h192", "title": "192 cm" },
                  { "id": "h193", "title": "193 cm" },
                  { "id": "h194", "title": "194 cm" },
                  { "id": "h195", "title": "195 cm" },
                  { "id": "h196", "title": "196 cm" },
                  { "id": "h197", "title": "197 cm" },
                  { "id": "h198", "title": "198 cm" },
                  { "id": "h199", "title": "199 cm" },
                  { "id": "h200", "title": "200 cm" },
                  { "id": "h201", "title": "201 cm" },
                  { "id": "h202", "title": "202 cm" },
                  { "id": "h203", "title": "203 cm" },
                  { "id": "h204", "title": "204 cm" },
                  { "id": "h205", "title": "205 cm" },
                  { "id": "h206", "title": "206 cm" },
                  { "id": "h207", "title": "207 cm" },
                  { "id": "h208", "title": "208 cm" },
                  { "id": "h209", "title": "209 cm" },
                  { "id": "h210", "title": "210 cm" }
                ]
              },
              {
                "type": "Footer",
                "label": "Continuar",
                "on-click-action": {
                  "name": "navigate",
                  "next": {
                    "type": "screen",
                    "name": "STEP_EMAIL"
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
                    "maior_glicemia": "${data.maior_glicemia}",
                    "aparelho_glicemia": "${data.aparelho_glicemia}",
                    "sintomas": "${data.sintomas}",
                    "alimentacao": "${data.alimentacao}",
                    "peso": "${data.peso}",
                    "altura": "${form.altura}"
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
      "title": "Seu E-mail",
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
        },
        "aparelho_glicemia": {
          "type": "string",
          "__example__": "sim"
        },
        "sintomas": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "__example__": ["energia", "visao"]
        },
        "alimentacao": {
          "type": "string",
          "__example__": "mais_ou_menos"
        },
        "peso": {
          "type": "string",
          "__example__": "p70"
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
            "type": "Form",
            "name": "form_step_email",
            "children": [
              {
                "type": "TextHeading",
                "text": "Quase lá!"
              },
              {
                "type": "TextBody",
                "text": "Me compartilha seu melhor e-mail para eu te enviar o relatório completo"
              },
              {
                "type": "TextInput",
                "label": "Seu melhor e-mail",
                "name": "email",
                "input-type": "email",
                "required": true,
                "helper-text": "Ex: seunome@email.com"
              },
              {
                "type": "Footer",
                "label": "Continuar",
                "on-click-action": {
                  "name": "navigate",
                  "next": {
                    "type": "screen",
                    "name": "STEP_FINAL"
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
                    "maior_glicemia": "${data.maior_glicemia}",
                    "aparelho_glicemia": "${data.aparelho_glicemia}",
                    "sintomas": "${data.sintomas}",
                    "alimentacao": "${data.alimentacao}",
                    "peso": "${data.peso}",
                    "altura": "${data.altura}",
                    "email": "${form.email}"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "id": "STEP_FINAL",
      "title": "Finalizar",
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
        },
        "aparelho_glicemia": {
          "type": "string",
          "__example__": "sim"
        },
        "sintomas": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "__example__": ["energia", "visao"]
        },
        "alimentacao": {
          "type": "string",
          "__example__": "mais_ou_menos"
        },
        "peso": {
          "type": "string",
          "__example__": "p70"
        },
        "altura": {
          "type": "string",
          "__example__": "h170"
        },
        "email": {
          "type": "string",
          "__example__": "joao@email.com"
        }
      },
      "layout": {
        "type": "SingleColumnLayout",
        "children": [
          {
            "type": "TextHeading",
            "text": "Tudo certo!"
          },
          {
            "type": "TextBody",
            "text": "Agora basta tocar no botão FINALIZAR para que seu cadastro seja concluído com sucesso. Em breve você receberá seu plano personalizado no e-mail informado."
          },
          {
            "type": "Form",
            "name": "form_final",
            "children": [
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
                    "tipo_diabetes": "${data.tipo_diabetes}",
                    "medicamentos": "${data.medicamentos}",
                    "anos_diabetes": "${data.anos_diabetes}",
                    "controle_diabetes": "${data.controle_diabetes}",
                    "pronto_socorro": "${data.pronto_socorro}",
                    "maior_glicemia": "${data.maior_glicemia}",
                    "aparelho_glicemia": "${data.aparelho_glicemia}",
                    "sintomas": "${data.sintomas}",
                    "alimentacao": "${data.alimentacao}",
                    "peso": "${data.peso}",
                    "altura": "${data.altura}",
                    "email": "${data.email}"
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
