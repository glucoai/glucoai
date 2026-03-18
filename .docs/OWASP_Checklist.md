# OWASP Checklist — Gluco IA

## Autenticação e Sessão
- [x] JWT com secret forte
- [x] Hash de senha com Argon2
- [ ] Recuperação de senha com fluxo seguro
- [ ] MFA para perfis administrativos

## Autorização
- [ ] Controle de acesso por role em todas as rotas sensíveis
- [ ] Escopo por clínica/tenant em todas as queries

## Validação de Entrada
- [x] Zod em endpoints
- [ ] Limites de payload e rate limit

## Exposição de Dados
- [x] Sem retorno de passwordHash
- [ ] Mask de logs sensíveis

## Segurança de Transporte
- [ ] TLS obrigatório em produção
- [ ] HSTS habilitado

## Dependências e Supply Chain
- [ ] Dependabot ou scanner automático
- [ ] SCA periódico

## Observabilidade e Incidentes
- [x] Sentry backend
- [x] Sentry frontend
- [ ] Alertas de erro críticos configurados

## Banco de Dados
- [ ] Least privilege no usuário do banco
- [ ] Backups automáticos e restauração testada

## Infra e Deploy
- [ ] Secrets somente via env
- [ ] Isolamento de rede entre serviços

## Testes
- [x] Checklist documentado
- [ ] Testes de carga executados e reportados
