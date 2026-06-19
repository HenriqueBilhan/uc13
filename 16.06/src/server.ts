import express  from "express";
import { pool } from "./database";

const app = express()
const PORT = 3000
app.use(express.json())

//Livros precisam de Título, Autor, Editora e Páginas

//Listar livros
app.get("/livro", async (req, res) => {
    try {
        const [titulos] = await pool.query("SELECT * FROM livro")
        return res.status(200).json(titulos)
    } catch(erro) {
        console.log("Erro: ", erro)
        return res.status(500).json("Erro ao buscar os títulos dos livros: " + erro)
    }
})

//CRIA livros
app.post("/livro", async (req, res) => {
    try {
        const { nome_livro, autor, editora, paginas } = req.body
        
        const [resultado] = await pool.query(
            "INSERT INTO livro (nome_livro, autor, editora, paginas) VALUES (?, ?, ?, ?)",
            [nome_livro, autor, editora, paginas]
        )
        return res.status(201).json("Livro cadastrado com sucesso!")
    } catch(erro) {
        return res.status(500).json("Erro interno do servidor: " + erro)
    }
})

//UPDATE
app.put("/livro/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { nome_livro, autor, editora, paginas } = req.body;

    const [resultado] = await pool.query(
      "UPDATE livro SET nome_livro = ?, autor = ?, editora = ?, paginas = ? WHERE id = ?",
      [nome_livro, autor, editora, paginas, id]
    );

    return res.status(200).json("Livro atualizado com sucesso!");
  } catch (erro) {
    return res.status(500).json("Erro interno do servidor: " + erro);
  }
});

app.patch("/livro/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const campos = req.body;

    const keys = Object.keys(campos);
    const values = Object.values(campos);

    if (keys.length === 0) {
      return res.status(400).json({
        mensagem: "Nenhum campo enviado para atualização."
      });
    }

    const setClause = keys.map((key) => `${key} = ?`).join(", ");

    await pool.query(
      `UPDATE livro SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return res.status(200).json({
      mensagem: "Livro atualizado parcialmente com sucesso!"
    });

  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      mensagem: "Erro interno do servidor"
    });
  }
});



//DELETE
app.delete("/livro/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await pool.query(
      "DELETE FROM livro WHERE id = ?",
      [id]
    );

    return res.status(200).json("Livro deletado");
  } catch (erro) {
    return res.status(500).json("Erro interno do servidor: " + erro);
  }
});

app.listen(PORT, () => {
  console.log("O servidor está no ar, ufa");
});
