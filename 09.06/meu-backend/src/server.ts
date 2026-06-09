import express from 'express';
import {pool} from './database'
/* 
A variavel app recebe a instancia do express. Ou seja, dentro dela, agora temos um objeto que, quando chamarmos, nos da acesso a varios métodos diferentes que vamos precisar para criar nosso servidor backend.
*/
const app = express()
/*
Indentifica em que porta nosso servidor escutará as requisições
*/
const PORT = 3000;
/* Estamos dizendo que nosso servidor vai utilizar e se comunicar, nas requisições e respostas, usando JSON
*/
app.use(express.json())
/*    Rotas são métodos especiais, que são chamados para fazer uma determinada requisição. Cada uma tem um metodo HTTP(GET, POST, PUT, DELETE)! O metodo, no express, é feito desta forma:
o primeiro argumento é o caminho para acessar esta rota, e o segundo argumento é a função executada quando chamarmos esta rota
app.métodoHTTP('caminho', () => {})
req é o objeto da requisição
res é o objeto da resposta
Método GET -> buscar uma informação*/
app.get('/mensagem', (req,res) =>{ 
    res.status(200).send("Olá Galera!")
})

app.get('/meunome', (req, res) => {
    res.status(200).send("Meu nome é Henrique;")
})
app.get('/usuarios', async (req, res) => {
    try {
    //query('consultaSQL) é um método da biblioteca do mysql2 que executa comandos SQL. Neste caso, estamos fazendo um SELECT e armazenando as informações na váriavel 'usuários'
        const [usuarios] = await pool.query(
            'SELECT * FROM usuarios'
        )
// retorna a resposta com status 200 (OK) e envia a lista de usuarios em formato JSON
    res.status(200).json(usuarios)
    }catch(erro){
        console.log("erro", erro)
        return res.status(500).json("Erro ao buscar usuário" + erro)
    }
})

//Cria Usuarios
app.post('/usuarios', async (req, res) => {
    try {
const {nome, email, senha} = req.body // estas informaçoes enviamos no corpo da nossa requisição
const[resultado] = await pool.query(
    "INSERT INTO usuarios (nome, email, senha)  VALUES (?, ?, ?)", {nome, email, senha}
)
// Status 201 -> Dado criado com sucesso
return res.status(201).json(resultado)
    } catch(erro){

    }
})
/* listem() é o metodo do express para colocar nosso servidor no ar. Ele precisa que passemos duas coisas como parâmetro:
o primeiro é a porta
o segundo é uma função que vai ser executada quando o servidor estiver no ar*/
app.listen(PORT, () =>{
    console.log("O servidor está no ar, ufa")
})