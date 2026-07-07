import "reflect-metadata";
import { DataSource } from "typeorm";
import { Selecao } from "./entities/Selecao";
import { Jogador } from "./entities/Jogador";

/**
 * Configuração da conexão com o banco de dados.
 *
 * Por padrão usamos SQLite (arquivo local "database.sqlite"), pois assim
 * o projeto roda sem precisar instalar/configurar um servidor de banco.
 *
 * Para usar MySQL ou PostgreSQL, basta trocar o "type" e os parâmetros
 * de conexão abaixo. Exemplo para PostgreSQL:
 *
 * export const AppDataSource = new DataSource({
 *   type: "postgres",
 *   host: "localhost",
 *   port: 5432,
 *   username: "postgres",
 *   password: "postgres",
 *   database: "selecoes_jogadores",
 *   synchronize: true,
 *   logging: true,
 *   entities: [Selecao, Jogador],
 * });
 */
export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true, // cria/atualiza as tabelas automaticamente (uso em dev/estudo)
  logging: true,
  entities: [Selecao, Jogador],
});
