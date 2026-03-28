# Organiza CC UVA

Site para acompanhar o curso de **Ciência da Computação** da **Universidade Estadual do Vale do Acaraú (UVA)**: progresso nas disciplinas, grade semanal e calendário acadêmico — sem depender de planilhas para checar conflitos de horário.

## Funcionalidades

| Área | O que faz |
|------|-----------|
| **Gerenciador de Disciplinas** | Marca disciplinas como concluídas; calcula o que está **disponível** a partir dos pré-requisitos; mostra **equivalentes** quando existem. Tudo persiste no **navegador** (localStorage). |
| **Organizador de Horários** | Monta a **semana** com as disciplinas disponíveis; destaca **conflitos** de horário; permite **exportar a grade** como imagem. |
| **Pesquisar Disciplinas** | Busca e filtra disciplinas da grade. |
| **Calendário acadêmico** | Eventos do calendário institucional (datas de matrícula, recesso, provas etc.), com busca e filtros. |
| **Planejador de Curso** | Apoio ao planejamento do percurso no curso. |
| **Sobre o projeto** | Estatísticas do seu progresso, tema claro/escuro, modo de exibição e links úteis (portal, RU, fluxograma). |

## Dados do projeto

- **`src/data/Disciplinas.csv`** — grade oficial do curso: id, nome, período, horários, pré-requisitos por id, carga horária e professor. É a fonte do gerenciador, da grade semanal e do planejador. Como editar com segurança: veja [CONTRIBUTING.md](CONTRIBUTING.md#atualizar-o-csv-de-disciplinas).
- **`src/data/Equivalentes.csv`** — equivalências; o campo que liga à grade é o **nome exato** da disciplina oficial em `Disciplinas.csv`.
- **`src/data/Eventos.ts`** — calendário acadêmico (extraído do PDF da coordenação).

## Como rodar

```bash
npm install
npm run dev
```

## Stack

- **Vite** · **React** · **TypeScript**
- **Tailwind CSS** · **Zustand**
- **react-big-calendar** · **date-fns** · **csv-parse** · **html2canvas-pro**
- **Biome**

## Contribuir

Veja **[CONTRIBUTING.md](CONTRIBUTING.md)** — atualização de disciplinas/equivalentes/eventos, fluxo de PR e comandos (`test`, `lint`, `build`, Husky).
