# Sistema de Seleções e Jogadores — TypeScript + TypeORM

Projeto de exemplo que modela duas entidades relacionadas (`Selecao` e
`Jogador`) e gera as tabelas correspondentes no banco de dados usando
TypeORM.

## Estrutura do projeto

```
selecoes-jogadores/
├── package.json
├── tsconfig.json
└── src/
    ├── data-source.ts      # configuração da conexão com o banco
    ├── index.ts             # script de exemplo (cria registros e consulta)
    └── entities/
        ├── Selecao.ts        # entidade Selecao (lado "um")
        └── Jogador.ts        # entidade Jogador (lado "muitos")
```

## Modelagem

**Selecao**
| Campo        | Tipo    |
|--------------|---------|
| id           | number (PK, auto) |
| nome         | string  |
| pais         | string  |
| tecnico      | string  |
| rankingFifa  | number  |
| anoFundacao  | number  |

**Jogador**
| Campo         | Tipo    |
|---------------|---------|
| id            | number (PK, auto) |
| nome          | string  |
| numeroCamisa  | number  |
| posicao       | string  |
| idade         | number  |
| altura        | number (decimal) |
| peso          | number (decimal) |
| gols          | number  |
| selecao       | Selecao (FK `selecao_id`) |

## Relacionamento

- `Selecao` possui `@OneToMany(() => Jogador, jogador => jogador.selecao)`
- `Jogador` possui `@ManyToOne(() => Selecao, selecao => selecao.jogadores)`
  com `@JoinColumn({ name: "selecao_id" })`

Ou seja: **uma Seleção tem vários Jogadores**, e **cada Jogador pertence a
apenas uma Seleção** — um relacionamento clássico 1:N.

## Banco de dados

Por padrão o projeto usa **SQLite** (arquivo `database.sqlite`, criado
automaticamente na primeira execução), para que ele rode sem precisar
instalar nenhum servidor de banco de dados.

Se preferir usar **MySQL** ou **PostgreSQL**, edite `src/data-source.ts` e
troque o `type` e os parâmetros de conexão (host, porta, usuário, senha,
nome do banco). Um exemplo para PostgreSQL já está comentado dentro do
arquivo.

`synchronize: true` faz o TypeORM criar/atualizar as tabelas
automaticamente a partir das entidades — ideal para fins de estudo (em
produção o recomendado é usar *migrations*).

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Rodar o projeto (cria as tabelas, insere dados de exemplo e consulta)
npm start
```

> Observação: a instalação do pacote `sqlite3` compila um módulo nativo na
> primeira vez (`node-gyp`), o que exige acesso à internet normal da sua
> máquina. Isso é esperado e só acontece uma vez.

Ao rodar `npm start` você verá no console:
- O log do TypeORM criando as tabelas `selecoes` e `jogadores`;
- Uma Seleção e dois Jogadores sendo inseridos;
- Uma consulta da Seleção já trazendo seus Jogadores (`relations: { jogadores: true }`);
- Uma consulta de Jogadores trazendo sua Seleção (`relations: { selecao: true }`).

## Scripts disponíveis

| Comando         | Descrição                                      |
|-----------------|-------------------------------------------------|
| `npm start`     | Executa `src/index.ts` com ts-node              |
| `npm run dev`   | Executa em modo watch (`ts-node-dev`)           |
| `npm run build` | Compila o TypeScript para `dist/`               |
