import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Selecao } from "./Selecao";

@Entity("jogadores")
export class Jogador {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  nome!: string;

  @Column({ name: "numero_camisa", type: "int" })
  numeroCamisa!: number;

  @Column({ type: "varchar", length: 50 })
  posicao!: string;

  @Column({ type: "int" })
  idade!: number;

  // altura em metros, ex: 1.78
  @Column({ type: "decimal", precision: 3, scale: 2 })
  altura!: number;

  // peso em quilogramas, ex: 75.50
  @Column({ type: "decimal", precision: 5, scale: 2 })
  peso!: number;

  @Column({ type: "int", default: 0 })
  gols!: number;

  // Um Jogador pertence a apenas uma Selecao.
  @ManyToOne(() => Selecao, (selecao) => selecao.jogadores, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "selecao_id" })
  selecao!: Selecao;
}
