# Contribuindo

Sugestões e correções são bem-vindas via **issue** ou **pull request**.

## Contribuir com código

1. Faça um fork e crie uma branch a partir de `main`.
2. Instale dependências e rode o app em desenvolvimento:

   ```bash
   npm install
   npm run dev
   ```

3. Antes de abrir o PR, confira que tudo passa localmente:

   | Comando | O que faz |
   |---------|-----------|
   | `npm run test` | Testes (Jest). |
   | `npm run lint` | Biome + `tsc --noEmit`. |
   | `npm run build` | Build de produção (inclui validação dos CSVs de disciplinas no pipeline de dados). |

4. O hook **pre-commit** (Husky) roda `npm run format`, `npm run lint` e `npm run test`. Commits que não passarem serão bloqueados até corrigir.

5. Descreva no PR o que mudou e por quê; se for correção de bug ou dado, cite a fonte quando fizer sentido.

---

## Atualizar o CSV de disciplinas

Fonte: **`src/data/Disciplinas.csv`**. A grade é lida em build. Se alguma linha estiver inválida, o **`npm run build`** **falha** com mensagem apontando o registro.

### Cabeçalho

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
| **professor** | opcional | Nome do docente. Vazio = ainda sem docente. |

### Formato de horarios

Cada “token” é **um dígito de dia** + **uma ou mais letras de bloco**, sem espaço no meio. Vários tokens na mesma célula = **separados por espaço**.

- **Dia:** `2` = Segunda … `7` = Sábado (igual ao padrão da UVA no código).
- **Blocos:** `A`…`S` = faixas horárias fixas em `src/lib/csvToObject.ts` (ex.: `B` 08:00–08:50, `C` 08:50–09:40).

Regex aceita por token: dia `2`–`7` + só letras `A`–`S` (ex.: `3IJKL` válido; `1AB` inválido).

### Checklist ao editar

1. Editar **`src/data/Disciplinas.csv`** (UTF-8; evita Excel quebrando acentos — prefira editor ou “CSV UTF-8”).
2. Se mudou **nome** de disciplina que tem equivalente, atualizar **`src/data/Equivalentes.csv`** (coluna que referencia o nome oficial).
3. Atualizar **`lastUpdated`** do bloco `Disciplinas` em **`src/data/index.ts`**.
4. Rodar **`npm run build`** para validar; corrigir até passar.
5. **Quem já usa o site:** trocar **ids** ou apagar disciplinas pode desalinhar o progresso salvo no **localStorage** do navegador (marcações antigas). Mudança de nome/horário/professor em geral não quebra ids já salvos.

### Equivalentes

Arquivo separado: **`src/data/Equivalentes.csv`**. A coluna que indica a disciplina da grade deve coincidir todos os caractere com nome em `Disciplinas.csv`. Atualize `DisciplinasEquivalentes.metadata.lastUpdated` em `src/data/index.ts` quando alterar esse CSV.

### Outros dados

- **`src/data/Eventos.ts`** — calendário acadêmico. Ao alterar, atualize o `lastUpdated` correspondente em `src/data/index.ts` quando o projeto usar esse metadata.
