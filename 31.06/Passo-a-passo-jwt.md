O que é o JWT? O que significa?

JWT significa Json Web Token. Ele é um código gerado e salvo no navegador que, entre outras coisas, guarda as informações de um usuário(exemplo: `{id: 1, email: Gabriel Noronha}`)

Como ele se parece? Ele se parece com isso aqui:
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJhbGljZUBtYWlsLmNvbSJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

Para o que ele serve? Ele serve para guardar informações de qual usuário está logado. Assim, nós podemos fazer requisições (exemplo, criar um post) sem pedir para que logue novamente toda vez. Também podemos garantir que um usuário crie, atualize, delete posts APENAS PARA SI MESMO ou veja apenas as SUAS informações e não a de outros, etc.

Por exemplo: vamos pensar no funcionamento de uma rede social. Imagine que você acessa o Instagram e quer criar um post. Você primeiro precisa ter uma conta e logar com ela. Nós usamos o jwt, justamente para fazer isso: logar. Outra coisa, você só consegue criar posts para SI MESMO. Não há como criar ou deletar, por exemplo, o post de OUTRO USUÁRIO. O JWT também garante isso, pois ele informa qual o id do usuário que está logado.

O token em si é dividido em três partes. As mais importantes para nós são as duas últimas: o Payload e a Signature.

O payload é a parte do meio. É ali que fica armazenado as informações como o id e email do usuário

O Signature é a terceira parte. Ali fica armazenado o "segredo", que é um código que cada sistema tem o seu. Ele garante que aquele token pertence aquele sistema. Se for modificado, por exemplo, ele é inválido. Isso evita que uma pessoa pegue qualquer token e tente usar em nosso sistema.

Como utilizar no nosso projeto? Vamos lá:

1 - Primeiro é preciso instalar as depêndencias:

```bash
    npm install jsonwebtoken @types/jsonwebtoken
```

2 - Para usarmos o JWT, agora vamos criar um arquivo chamado `jwt.ts` dentro da pasta `utils`.

Dentro deste arquivo, precisamos então:

    2.1 - importar tudo que é necessário: o jwt e também o dotenv (pois teremos variáveis importantes lá):
```ts
    import jwt from 'jsonwebtoken'
    import * as dotenv from 'dotenv'
```

2.3 = no .env, precisamos ter as variáveis correspondentes:
```ts
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=rede_social

PORT= 3000
//estas são as variaveis do ambiente
JWT-SECRET =minhaChaveSecreta // serve para converter depois na ssinatura do token (singnature)
JWT_EXPIRES_IN= 86400 // identifica por quanto tempo o token é valido(nesse caso, um dia: 86400 segundos)

```
2.4 - voltando ao arquivo jwt.ts, vamos criar uma interface chamada payloand para representar o que nós esperamos que nosso token receba:

```ts
interface Payload {
    id:number
    email:string
}
```
2.5 - agora, vamos criar uma metodo que gera um novo token. geralmente, chamamos esse método dentro de uma função login, etc;

```ts

//Nunca se esqueça do 'export' ou não poderemos usar esta função em outros arquivos
//nosso método recebe por parâmetro um objeto que deve ter id e email ( por causa da nossa interface)
export function generateToken(payload:Payload){
// o métdo sign() da biblioteca di jwt serve para criar um novo token.
// Para issom passamos para ele, nesta ordem:
// 1 - o payload com as informações do usuario
// 2 - o 'segredo' que está no JWT_SECRET
// 3 - um objeto (ou seja, entre 'chaves': {}) que contém a opção 'expiresIn', com o valor de JWT_EXPIRES_IN=86400', no sign() você precisa chamá-lo dentro de 'Number()' para convertê-lo
return jwt.sign(payload, JWT_SECRET!, {
    expiresIn: Number(JWT_EXPIRES_IN)
})

// o argumento com o JWT_SECRET tem um '!' no final pois o TYPESCRIPT sabe que pode ser que o .env não tenha essa informação. Ao colocar o ponto de exclamação, é como se dissérmos: "tem sim, confia no pai"
}

```
    2.6 - Criamos a função  que gera o token. agora vamos criar á função qie analisa se ele é válido ou não:

 ```ts
 // o token vem no formato de string mesmo
    export function verifyToken(token:string){
        try{
            //chamamos a função verify() da biblioteca do jwt para fazer a verificação
            //o primeiro argumento é o próprio token
            // o segundo  é o JWT_SECRET
            //se for válido, a função retorna as infos do usuário
            return jwt.verify(token, JWT_SECRET!)
        
        } catch {
            // se não for, retorna nulo
            return null
        }
    }
```

   Extra: se quiser testar, no mesmo arquivo você pode chamar os dois métodos, primeiro o generate e depois o verify:
   ```ts
   // gere um token com as infos que quiser
   const token = generateToken({id:1, email:"h@gmail"}) 
// mostre o token no terminal
console.log(token)
// depois, confira se o token é válido (se for o token que acabamos de gerarm sempre vai ser válido)
const tokenValido = verifyTokeb(token)
console.log(tokenValido) // se mostrar as infos do usuario ele é valido, se mostrar null não é 
```
Depois, rode com o comando:
```bash 
npx ts-node-dev src/utils/jwt.ts
```

3 - se nao tivermos uma função que procura por email no UserRepository, precisamos criá-la. Se já tem, podemos pular esta etapa. Vá até UserRepository e adicione a seguinte função:

```ts
async findByEmail(email: string){
    //findOne() é uma função do TypeOrm que retorna um unico resultado (se usassemos apenas find() ele retornaria um array!)
    return repo.findoOne({where: email})
}
```
4 - na camada service, vamos prewcisar adicionar mais algumas coisas.
4.1 - adicionar uma extensão da classe 'error' que vamos dar o nome de "UnauthorizedError" (Unauhtorized = não autorizado). adicione a seguinte linha em "UserService.ts" :
```ts
export class UnauthorizedError extends error {}
```
4.2 - Vamos adicionar um método de login dentro de "UserService.ts" . Este métdo vai receber um email e uma senha, validar se existe o email usando o "UserRepository.findByEmail()" que criamos há pouco, depois valida atravesdo método bcrypt.compare() se a senha bate com a criptografia dela do banco, e, se tudo estiver de acordom ai sim gera um token chamando o método "jwt.generateToken()" que nos criamos antes. então, no arquivo "UserService.ts" crie:
```ts
async login(data: {email:string, password:string}){

    const user = await UserRepository.findByEmail(data.email)
    if(!user) throw new NotFoundError("Email incorreta!")

    const isValid = await bcrypt.compare(data.password, user.password)
if (!user|| !password) throw new UnauthorizedError("informações incorretas. ")

const token = jwt.generateToken({
    user.id,
    user.email
})

console.log(token)

return {
    user: omitPassword(user),
    token
 }
}
```

5 - agora, depois de services, vamos para a camada Controllers, onde vamos criar um arquivo chamado "authController.ts". Ele ficará responsavel pela parte do login. dentro dele, insira:

5.1 - as inportações:

``` ts
import {Request, Response, NextFunction} from 'express'
import {UserService} from '../services/UserService.ts'
```
5.2 - O método de Login:

```ts
export class AuthController {
    async login (req: Request, res: Response, next: NextFunction){
try {
const{email, password} = req.body

const result = await UserService.login({email, password})

return res.status(200).json(result)
} catch(){
next(error)
}
    }
}