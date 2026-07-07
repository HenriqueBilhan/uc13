import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { Selecao } from "./entities/Selecao";
import { Jogador } from "./entities/Jogador";

async function main() {
  // Inicializa a conexão e cria as tabelas no banco (synchronize: true)
  await AppDataSource.initialize();
  console.log("Conexão com o banco de dados estabelecida.");

  const selecaoRepository = AppDataSource.getRepository(Selecao);
  const jogadorRepository = AppDataSource.getRepository(Jogador);

  // ----- Criando uma Seleção -----
  const brasil = selecaoRepository.create({
    nome: "Seleção Brasileira",
    pais: "Brasil",
    tecnico: "Carlo Ancelotti",
    rankingFifa: 5,
    anoFundacao: 1914,
  });
  await selecaoRepository.save(brasil);
  console.log("Seleção salva:", brasil);

  // ----- Criando Jogadores vinculados à Seleção -----
  const jogador1 = jogadorRepository.create({
    nome: "Vinicius Junior",
    numeroCamisa: 7,
    posicao: "Atacante",
    idade: 25,
    altura: 1.76,
    peso: 73,
    gols: 30,
    selecao: brasil,
  });

  const jogador2 = jogadorRepository.create({
    nome: "Alisson Becker",
    numeroCamisa: 1,
    posicao: "Goleiro",
    idade: 33,
    altura: 1.91,
    peso: 91,
    gols: 0,
    selecao: brasil,
  });

  await jogadorRepository.save([jogador1, jogador2]);
  console.log("Jogadores salvos.");

  // ----- Consultando a Seleção junto com seus Jogadores -----
  const selecaoComJogadores = await selecaoRepository.find({
    relations: { jogadores: true },
  });

  console.log(
    "Seleções com seus jogadores:",
    JSON.stringify(selecaoComJogadores, null, 2)
  );

  // ----- Consultando um Jogador junto com sua Seleção -----
  const jogadorComSelecao = await jogadorRepository.find({
    relations: { selecao: true },
  });

  console.log(
    "Jogadores com sua seleção:",
    JSON.stringify(jogadorComSelecao, null, 2)
  );

  await AppDataSource.destroy();
}

main().catch((error) => {
  console.error("Erro ao executar a aplicação:", error);
  process.exit(1);
});
