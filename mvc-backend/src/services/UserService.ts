import {pool} from "../config/database";
import  {Usuario}  from "../models/User";

export class UsuarioService {

    async create(email: string, senha: string) {

        const usuario = new Usuario(
            email,
            senha
        );

        const [result] = await pool.query(
            "INSERT INTO usuarios (email, senha) VALUES (?, ?)",
            [
                usuario.getEmail(),
                usuario.getSenha()
            ]
        );

        return result;
    }

    async findAll() {

        const [rows] = await pool.query(
            "SELECT * FROM usuarios"
        );

        return rows;
    }

    async findById(id: number) {

        const [rows]: any = await pool.query(
            "SELECT * FROM usuarios WHERE id = ?",
            [id]
        );

        return rows[0];
    }

    async update(
        id: number,
        email: string,
        senha: string
    ) {

        const [result] = await pool.query(
            `UPDATE usuarios
             SET email = ?, senha = ?
             WHERE id = ?`,
            [
                email,
                senha,
                id
            ]
        );

        return result;
    }

    async delete(id: number) {

        const [result] = await pool.query(
            "DELETE FROM usuarios WHERE id = ?",
            [id]
        );

        return result;
    }
}