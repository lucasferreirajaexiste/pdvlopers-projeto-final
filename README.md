
# Balcão — Projeto Final (Monorepo)

Nome: Balcão

## Descrição

A aplicação "Balcão" tem como finalidade ajudar mercadinhos de vila — estabelecimentos pequenos e muitas vezes com poucos recursos tecnológicos — a terem maior controle sobre as finanças e a operação diária do negócio.

O sistema funciona como um PDV (Ponto de Venda) simplificado, sem integração fiscal com a SEFAZ. O objetivo é oferecer uma solução prática, sem burocracia, que permita ao comerciante:

- organizar vendas e movimentos de caixa;
- registrar produtos e promoções;
- acompanhar o desempenho financeiro (entradas, saídas, relatórios básicos);
- enviar mensagens de fidelidade e gerenciar promoções e pontos.

O foco é simplicidade e acessibilidade: a interface, os processos e os requisitos técnicos foram pensados para facilitar a adoção por pequenos comerciantes sem experiência profunda em informática.

## Público-alvo

Proprietários e gestores de pequenos mercadinhos e minimercados locais que ainda não utilizam ferramentas digitais de gestão. A solução privilegia usabilidade, baixo atrito na instalação e operações que façam sentido no dia a dia desses estabelecimentos.

## Objetivos do projeto

- Inserir comerciantes no universo digital com uma ferramenta fácil de usar;
- Reduzir perdas e melhorar visibilidade das finanças do ponto de venda;
- Permitir decisões mais conscientes com relatórios simples;
- Ser uma solução leve, de baixo custo e rápida implementação.

## Estrutura do monorepo (resumida)

- `back/` — API (Express), scripts e scheduler.
- `front/` — Frontend (Vite + React) e servidor de desenvolvimento local.

Para detalhes de instalação e scripts de cada subprojeto, consulte os respectivos `package.json` e os READMEs locais (`back/README.md`, `front/README.md`).

## Como rodar (resumo rápido)

- Backend (dev):

   PS> cd back
   PS> npm install
   PS> npm run dev

- Frontend (dev):

   PS> cd front
   PS> npm install
   PS> npm run dev:frontend

## Testes e lint (resumo)

- Executar testes:

   PS> cd back && npm test
   PS> cd front && npm test

- Executar linter:

   PS> cd back && npm run lint
   PS> cd front && npm run lint

## Configuração de ambiente

Copie `.env.example` para `.env` em `back/` e `front/` e ajuste as variáveis conforme necessário.

## Atualizar subprojetos com git subtree

Quando precisar atualizar `front` ou `back` a partir de outra branch remota usando subtree, exemplos:

```powershell
# Atualizar o front vindo de novas branchs
git subtree pull --prefix=front origin xyz -m "update front from xyz"

# Atualizar o back vindo de novas branchs
git subtree pull --prefix=back origin abc -m "update back from abc"
```

