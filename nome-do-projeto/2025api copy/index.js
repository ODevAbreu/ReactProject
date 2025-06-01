const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Conexão com o banco de dados
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "coffee",
    port: "3306"
});

conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

const gerarToken = (id, email) => {
     return jwt.sign({ id: id, email: email, permissoes: ['USUARIO','PRODUTO'] }, 'cafezera', {
        expiresIn: '1h'
    });
}
const validarToken = (token) => {
    return jwt.verify(token, 'cafezera');
};
const Autenticar = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    // console.log(token)
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
      //verica se o token foi gerado por este servidor
      //validando a palavra chave
      const tokenValidado = validarToken(token);
      req.userId = tokenValidado.id;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token inválido' });
    }
}



// Cria a pasta 'uploads' se não existir
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuração do multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage: storage });

// Rota de upload de imagem
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    const imagePath = `/uploads/${req.file.filename}`;
    res.status(200).json({ path: imagePath });  
});


// Rotas de usuário
app.get('/api/usuario', (req, res) => {
    const sql = "SELECT id, nome, email, senha, Dt_Nasc, telefone, cpf FROM usuario";
    conn.query(sql, (err, result) => {
        if (err) return res.status(500).json();
        res.status(200).json(result);
    });
});
app.get('/api/usuario/:id', Autenticar, function (req, res) {
    // const { id } = req.params;

    // console.log(id)

    let sql = `SELECT u.Id, u.Nome FROM usuario u WHERE u.Id = ${id}`;
    conn.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result)
        res.status(200).json(result[0]);
    });
});



app.post('/api/usuario', (req, res) => {
    const usuario = req.body;
    const sql = `INSERT INTO usuario (nome, email, senha, Dt_Nasc, telefone, cpf) VALUES 
        ('${usuario.nome}', '${usuario.email}', '${usuario.senha}', '${usuario.Dt_Nasc}',
        '${usuario.telefone}', '${usuario.cpf}')`;
    conn.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "erro de inserção" , erro: err.message });
        res.status(201).json({ id: result.insertId, ...usuario });
    });
});

app.delete('/api/usuario/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM usuario WHERE id = ?";
    conn.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json({ mensagem: "Usuário excluído com sucesso" });
    });
});

// Rotas de produto
app.get('/api/produto', (req, res) => {
    const sql = "SELECT * FROM produto p";
    conn.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(result);
    });
});

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

app.delete('/api/produto/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM produto WHERE ID_Produto = ?";
    conn.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json({ mensagem: "Produto excluído com sucesso" });
    });
});

app.get('/api/produto/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM produto p WHERE p.ID_Produto = ${id}`;
    conn.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(result[0]);
    });
});

// Rota de login
app.post("/usuario/login", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ success: false, message: "Campos obrigatórios" });
    }

    const query = "SELECT Id, Nome, Email, ADM FROM usuario WHERE Email = ? AND BINARY Senha = ?";
    conn.query(query, [email, senha], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro no servidor" });
        }

        if (results.length > 0) {
            const token = gerarToken(results[0].Id, results[0].Email);
            res.json({success: true,token: token, usuario: results[0] });
            // res.json({ success: true, usuario: results[0] });

        } else {
            res.json({ success: false, message: "Credenciais inválidas" });
        }
    });
});

app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});
