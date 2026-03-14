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

- **`data/Disciplinas.csv`** — grade oficial do curso: id, nome, período, horários (blocos semanais), pré-requisitos por id, carga horária e professor. É a fonte do gerenciador, da grade semanal e do planejador. Detalhes de edição na seção abaixo.
- **`data/Equivalentes.csv`** — equivalências (optativas); o campo que liga à grade é o **nome exato** da disciplina oficial em `Disciplinas.csv`.
- **`data/Eventos.ts`** — calendário acadêmico (extraído do PDF da coordenação).

---

## Como atualizar as disciplinas (`data/Disciplinas.csv`)

A grade é lida em build por `lib/csvToObject.ts`. Se alguma linha estiver inválida, o **`npm run build`** **falha** com mensagem apontando o registro.

### Cabeçalho (obrigatório)

A primeira linha deve ser exatamente:

```text
id,nome,periodo,horarios,requisitos,carga_horaria,professor
```

### Colunas

O cabeçalho define **sete colunas em toda linha** — não remova colunas. **Opcional** aqui significa só que **o valor da célula pode ficar vazio** (a coluna continua lá, com vírgula e célula vazia se precisar).

| Coluna | Valor | Descrição |
|--------|-------|-----------|
| **id** | obrigatório | Número inteiro único. Os **requisitos** de outras linhas referenciam esses ids. |
| **nome** | obrigatório | Como no fluxograma/catálogo. **Não mude à toa**: `Equivalentes.csv` amarra pelo nome. |
| **periodo** | obrigatório | Texto livre (ex.: `1° Período`). Só organização visual. |
| **horarios** | opcional | Ver formato abaixo. Vazio = sem horário na grade. |
| **requisitos** | opcional | Ids dos pré-requisitos, **separados por vírgula** (ex.: `2`, `11,10,9`). Vazio = sem requisito. |
| **carga_horaria** | obrigatório | Número (ex.: `60`, `100`). |
| **professor** | opcional | Nome do docente. Vazio = ainda sem docente (última célula da linha vazia, ex.: `...,60,`). |

### Formato de **horarios** (grade semanal)

Cada “token” é **um dígito de dia** + **uma ou mais letras de bloco**, sem espaço no meio. Vários tokens na mesma célula = **separados por espaço**.

- **Dia:** `2` = Segunda … `7` = Sábado (igual ao padrão da UVA no código).
- **Blocos:** `A`…`S` = faixas horárias fixas em `lib/csvToObject.ts` (ex.: `B` 08:00–08:50, `C` 08:50–09:40).

Exemplos:

| Valor no CSV | Significado |
|--------------|-------------|
| `2BC 4BCDE` | Segunda nos blocos B–C; Quarta nos blocos B–E. |
| `5IJKL` | Quinta, blocos I até L (um intervalo contínuo por token). |
| *(vazio)* | Disciplina sem horário (ex.: só requisito / sem turma fixa na planilha). |

Regex aceita por token: dia `2`–`7` + só letras `A`–`S` (ex.: `3IJKL` válido; `1AB` inválido).

### Checklist ao editar

1. Editar **`data/Disciplinas.csv`** (UTF-8; evita Excel quebrando acentos — prefira editor ou “CSV UTF-8”).
2. Se mudou **nome** de disciplina que tem equivalente, atualizar **`data/Equivalentes.csv`** (coluna que referencia o nome oficial).
3. Atualizar **`lastUpdated`** do bloco `Disciplinas` em **`data/index.ts`**.
4. Rodar **`npm run build`** para validar; corrigir até passar.
5. **Quem já usa o site:** trocar **ids** ou apagar disciplinas pode desalinhar o progresso salvo no **localStorage** do navegador (marcações antigas). Mudança de nome/horário/professor em geral não quebra ids já salvos.

### Equivalentes

Arquivo separado: **`data/Equivalentes.csv`**. A coluna que indica a disciplina da grade deve coincidir **caractere a caractere** com **`nome`** em `Disciplinas.csv`. Atualize `DisciplinasEquivalentes.metadata.lastUpdated` em `data/index.ts` quando alterar esse CSV.

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Build de produção: `npm run build` → `npm start`.

## Stack

- **Next.js** (App Router) · **React** · **TypeScript**
- **Tailwind CSS** · **Zustand** (estado)
- **react-big-calendar** · **date-fns** · **csv-parse** · **html2canvas-pro**
- **Biome** (lint/format)

## Contribuir

Sugestões e correções são bem-vindas via **issue** ou **pull request** neste repositório.
