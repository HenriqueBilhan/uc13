export class User {
    public id: number;
    public password: string;
    public email: string;

    constructor(id: number, password: string, email: string) {
        this.id = id;
        this.email = email;
        this.password = password;
    }
public getId(): number | undefined {
    return this.id;
}
public setId(id: number): void {
this.id = id
}
public getEmail(): string {
    return this.email;
}
public setEmail(email: string): void {
    this.email = email;
}
public getpassword(): string {
    return this.password;
}
public setpassword(password: string): void {
    this.password = password;
}

}
