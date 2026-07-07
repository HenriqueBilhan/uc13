import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Jogador } from "./Jogador";

@Entity("selecoes")
export class Selecao {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  nome!: string;

  @Column({ type: "varchar", length: 100 })
  pais!: string;

  @Column({ type: "varchar", length: 100 })
  tecnico!: string;

  @Column({ name: "ranking_fifa", type: "int" })
  rankingFifa!: number;

  @Column({ name: "ano_fundacao", type: "int" })
  anoFundacao!: number;

  // Uma Selecao possui varios Jogadores.
  // "selecao" referencia a propriedade inversa definida em Jogador.
  @OneToMany(() => Jogador, (jogador) => jogador.selecao, {
    cascade: true,
  })
  jogadores!: Jogador[];
}
