export class User {

    private id?: number
    private nome: string
    private email: string
    private senha: string

    constructor(id: number | undefined, nome: string, email: string, senha: string) {
        this.id = id
        this.nome = nome
        this.email = email
        this.senha = senha
    }

    public getId(): number | undefined {
        return this.id
    }

    public setId(id: number): void {
        this.id = id
    }
    
    public getNome(): string {
        return this.nome
    }

    public setNome(nome: string): void {
        this.nome = nome
    }

    public getEmail(): string {
        return this.email
    }

    public setEmail(email: string): void {
        this.email = email
    }

    public getSenha(): string {
        return this.senha
    }

    public setSenha(senha: string): void {
        this.senha = senha
    }

}