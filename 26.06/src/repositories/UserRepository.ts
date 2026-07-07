import { ResultSetHeader, RowDataPacket } from "mysql2"
import { pool } from "../config/conexao"
import { User } from "../models/User"

interface UserRow extends RowDataPacket {
    id: number
    nome: string
    email: string
    senha: string
}

export class UserRepository {

    async findAll(): Promise<User[]> {
        const [rows] = await pool.query<UserRow[]>('SELECT * FROM users')
        return rows.map(user => new User(user.id, user.nome, user.email, user.senha))
    }

    async findById(id: number): Promise<User | null> {
        const [result] = await pool.query<UserRow[]>('SELECT * FROM users WHERE id = ?', [id])

        if (result.length === 0) return null

        const user = result[0]

        return new User(user.id, user.nome, user.email, user.senha)
    }

    async findByEmail(email: string): Promise<User | null> {
        const [result] = await pool.query<UserRow[]>('SELECT * FROM users WHERE email = ?', [email])

        if (result.length === 0) return null

        const user = result[0]

        return new User(user.id, user.nome, user.email, user.senha)
    }

    async create(user: User): Promise<User> {
        const [result] = await pool.query<ResultSetHeader>('INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)', [user.getNome(), user.getEmail(), user.getSenha()])

        return new User(result.insertId, user.getNome(), user.getEmail(), user.getSenha())
    }

    async update(user: User): Promise<User> {
        await pool.query<ResultSetHeader>('UPDATE users SET nome = ?, email = ?, senha = ? WHERE id = ?', [user.getNome(), user.getEmail(), user.getSenha(), user.getId()])

        return new User(user.getId(), user.getNome(), user.getEmail(), user.getSenha())
    }

    async delete(id: number): Promise<Boolean> {
        const [result] = await pool.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id])
        return result.affectedRows > 0
    }

}
