const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

// Conexão com o banco de dados
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "coffee",
    port: "3306"
});

conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

// Buscar todos os usuários
app.get('/api/usuario', (req, res) => {
    const sql = "SELECT id, nome, email, senha, Dt_Nasc, telefone, cpf FROM usuario";
    conn.query(sql, (err, result) => {
        if (err) return res.status(500).json();
        res.status(200).json(result);
    });
});

// Cadastrar ou atualizar um usuário
app.post('/api/usuario', (req, res) => {
    const usuario = req.body; 
        sql = `INSERT INTO usuario (nome, email, senha, Dt_Nasc, telefone, cpf) VALUES 
        ('${usuario.nome}', '${usuario.email}', '${usuario.senha}',  '${usuario.Dt_Nasc}',
        '${usuario.telefone}', '${usuario.cpf}')`;
        conn.query(sql, (err, result) => {
            console.log(err);
            if (err) return res.status(500).json({ message : "error de inserçao"});
            res.status(201).json({ id: result.insertId, ...usuario });
        });
    }
);



app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});

// CRUD dos Produtos

// Buscar todos os produtos
app.get('/api/produto', (req, res) => {
    const sql = "SELECT * FROM produto p";
    conn.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(result);
    });
});

// Cadastrar ou atualizar produto
app.post('/api/produto', (req, res) => {
    const produto = req.body;

    if (produto.id) {
        const sql = "UPDATE produto SET Nome_Produto = ?, Descr_Produto = ?, Tipo_prod = ?, Preco_prod = ?, Qtn_Produto = ?, imagem_prod = ? WHERE ID_Produto = ?";
        conn.query(sql, [produto.nome, produto.descr, produto.tipo, produto.preco, produto.qtd, produto.imagem, produto.id], (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(200).json(result);
        });
    } else {
        const sql = `INSERT INTO produto (Nome_Produto, Descr_Produto, Preco_prod, Tipo_prod, Qtn_Produto, imagem_prod) VALUES 
        ('${produto.nome}', '${produto.descr}', '${produto.preco}', '${produto.tipo}', '${produto.qtd}', '${produto.imagem}')`;
        conn.query(sql, (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(201).json(produto);
        });
    }
});

// Deletar produto
app.delete('/api/produto/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM produto WHERE ID_Produto = ?";
    conn.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Erro ao excluir produto:", err);
            return res.status(500).json({ erro: err.message });
        }
        res.status(200).json({ mensagem: "Produto excluído com sucesso" });
    });
});

// Buscar produto por ID
app.get('/api/produto/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM produto p WHERE p.ID_Produto = ${id}`;
    conn.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(result[0]);
    });
});
// Rota de login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ success: false, message: "Campos obrigatórios" });
  }

  const query = "SELECT * FROM usuario WHERE email = ? AND senha = ?";
  conn.query(query, [email, senha], (err, results) => {
    if (err) {
      console.error("Erro ao consultar o banco:", err);
      return res.status(500).json({ success: false, message: "Erro no servidor" });
    }

    if (results.length > 0) {
      res.json({ success: true, usuario: results[0] });
    } else {
      res.json({ success: false, message: "Credenciais inválidas" });
    }
  });
});
