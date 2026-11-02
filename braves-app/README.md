# Braves CT · App de Treino

Versão do app de treino com a identidade da Braves CT. Tem as mesmas funções do app original, com visual novo, animações e recursos extras.

**Aluno:** Início (treino do dia, meta da semana, periodização) · Meu Treino (vídeos + cronômetro de descanso) · Registrar cargas (mostra a última carga, barra de progresso, confete ao salvar) · Evolução (recorde, % de evolução, gráficos).

**Coach:** Alunos (cadastro com unidade e modalidade, busca, filtro por unidade) · Progresso · Editar Treino · Criar Treino (divisão, periodização, exercícios, alongamentos).

## Trocar logo e cores (1 arquivo)

Tudo que é marca fica em `src/brand.js`:

- `cores.primaria` / `cores.secundaria`: coloque os códigos oficiais (ex.: `#E1252B`).
- `logoUrl`: salve o logo em `public/brand/` e informe o caminho, ex.: `"/brand/logo-braves.png"`.
- `unidades`, `modalidades`, `slogan`: edite à vontade.
- `demo: false` esconde os botões de teste do login (use em produção).

Os ícones `public/icon*.png` e `public/icon.svg` usam o emblema provisório: troque pelos do logo oficial.

## Rodar no computador

```bash
cd braves-app
npm install
npm run dev
```

## Publicar na Vercel

1. vercel.com → **Add New → Project** → importe o repositório `migueljoly-app`.
2. Em **Root Directory**, escolha `braves-app`.
3. Framework: **Vite** (detecta sozinho). Clique em **Deploy**.

## Acessos de demonstração

| Perfil | Email | Senha |
|---|---|---|
| Coach | coach@braves.app | braves123 |
| Aluno | lucas@braves.app | aluno123 |

Todos os alunos da demonstração são fictícios.

## Importante antes de liberar para a franquia

Igual ao app original, os dados ficam salvos **no navegador de cada aparelho** (localStorage). Para o aluno entrar pelo próprio celular e o coach ver os registros dele, o próximo passo é ligar o app ao **Supabase** (login real + banco de dados compartilhado).
