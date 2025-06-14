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
        if (err) return res.status(500).json({success: false, message: "erro de inserção" , erro: err.message });
        res.status(201).json({ success: true, id: result.insertId, ...usuario });
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

app.post('/api/produto', Autenticar, (req, res) => {
    const produto = req.body;
    
    if (produto.id) {
        const sql = "UPDATE produto SET Nome_Produto = ?, Descr_Produto = ?, Tipo_prod = ?, Preco_prod = ?, Qtn_Produto = ?, imagem_prod = ? WHERE ID_Produto = ?";
        conn.query(sql, [produto.nome, produto.descr, produto.tipo, produto.preco, produto.qtd, produto.imagem, produto.id], (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(200).json(result);
            console.log("erro")
        });
    } else {
        const sql = `INSERT INTO produto (Nome_Produto, Descr_Produto, Preco_prod, Tipo_prod, Qtn_Produto, imagem_prod) VALUES 
            ('${produto.nome}', '${produto.descr}', '${produto.preco}', '${produto.tipo}', '${produto.qtd}', '${produto.imagem}')`;
        conn.query(sql, (err, result) => {
            // console.log(sql)
            if (err) return res.status(500).json(err);
            // console.log("erro")
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

// Rotas Do Endereço 

app.post('/api/endereco',Autenticar, (req, res) => {
    const endereco = req.body;
    const sql = `INSERT INTO endereco (Rua,Numero,Cidade,CEP,Bairro,fk_ID_Usuario) VALUES 
        ('${endereco.Rua}', '${endereco.Numero}', '${endereco.Cidade}', '${endereco.CEP}',
        '${endereco.Bairro}', '${ endereco.fk_ID_Usuario}')`;
    conn.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "erro de inserção" , erro: err.message });
        res.status(201).json({ id: result.insertId, ...endereco });
    });
});



app.put('/api/endereco/:id', (req, res) => {
  const id = req.params.id;
  const { Rua, Numero, Cidade, CEP, Bairro } = req.body;

  const sql = `
    UPDATE endereco
    SET Rua = ?, Numero = ?, Cidade = ?, CEP = ?, Bairro = ?
    WHERE ID_Endereco = ?`;

  conn.query(sql, [Rua, Numero, Cidade, CEP, Bairro, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Erro ao atualizar", erro: err.message });

    res.status(200).json({ message: "Endereço atualizado com sucesso" });
  });
});

app.get('/api/endereco/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM endereco WHERE ID_Endereco = ?';

  conn.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Erro ao buscar", erro: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Endereço não encontrado" });
    res.status(200).json(result[0]);
  });
});

app.get("/api/endereco/usuario/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "SELECT * FROM endereco WHERE fk_ID_Usuario = ?";

  conn.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar endereços do usuário:", err);
      return res.status(500).json({ erro: "Erro ao buscar endereços" });
    }

    res.json(results); 
  });
});

app.delete('/api/endereco/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM endereco WHERE ID_Endereco = ?';
  conn.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({success: false, message: "Erro ao excluir", erro: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Endereço não encontrado" });
    res.status(200).json({ success: true, message: "Endereço excluído com sucesso" });
  });
});



// Obtém carrinho do usuário
app.get("/api/carrinho/:idUsuario", (req, res) => {
  const idUsuario = req.params.idUsuario;
  
  const sql = `SELECT
                p.ID_Produto,
                p.Nome_Produto,
                p.Descr_Produto,
                p.Preco_prod,
                p.Tipo_prod,
                qp.Qtn_Produto
            FROM 
                Produto p
            JOIN 
                QTD_Produto qp ON p.ID_Produto = qp.fk_Produto_ID_Produto
            JOIN 
                Compra c ON qp.fk_Compra_ID_Compra = c.ID_Compra
            WHERE 
                c.ID_Usuario = ?
                AND c.Status = 'aberta'
                AND p.Qtn_Produto > 0;`;



  conn.query(sql, [idUsuario], (err, result) => {
    if (err) return res.status(500).json([]); // Retorna array vazio em caso de erro
    // Retorna o resultado (que pode ser array vazio)
    res.status(200).json(result || []); // Garante que nunca retorne null/undefined
  });
});

// Atualiza quantidade de um produto no carrinho
app.post("/api/carrinho/:idUsuario/atualizar/:idProduto", (req, res) => {
  const { idUsuario, idProduto } = req.params;
  const { qtd } = req.body;
  const sql = `UPDATE compra SET Quantidade = ? WHERE fk_ID_Usuario = ? AND fk_ID_Produto = ?`;
  conn.query(sql, [qtd, idUsuario, idProduto], (err) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.sendStatus(200);
  });
});



// Adiciona produto ao carrinho ou incrementa quantidade
app.post("/api/carrinho/:idUsuario/adicionar", (req, res) => {


  // const sqlCheck = `SELECT Quantidade FROM compra WHERE fk_ID_Usuario = ? AND fk_ID_Produto = ?`;
  // conn.query(sqlCheck, [idUsuario, idProduto], (err, rows) => {




  // const { idUsuario } = req.params;
  // const { idProduto, quantidade } = req.body;
  // const sqlCheck = `SELECT Quantidade FROM compra WHERE fk_ID_Usuario = ? AND fk_ID_Produto = ?`;
  // conn.query(sqlCheck, [idUsuario, idProduto], (err, rows) => {
  //   if (err) return res.status(500).json({ erro: err.message });
  //   if (rows.length > 0) {
  //     const novaQtd = rows[0].Quantidade + quantidade;
  //     const sqlUpd = `UPDATE compra SET Quantidade = ? WHERE fk_ID_Usuario = ? AND fk_ID_Produto = ?`;
  //     conn.query(sqlUpd, [novaQtd, idUsuario, idProduto], (err2) => {
  //       if (err2) return res.status(500).json({ erro: err2.message });
  //       res.sendStatus(200);
  //     });
  //   } else {
  //     const sqlIns = `INSERT INTO compra (fk_ID_Usuario, fk_ID_Produto, Quantidade) VALUES (?, ?, ?)`;
  //     conn.query(sqlIns, [idUsuario, idProduto, quantidade], (err3) => {
  //       if (err3) return res.status(500).json({ erro: err3.message });
  //       res.sendStatus(201);
  //     });
  //   }
  // });




});

// Remove produto do carrinho
app.delete("/api/carrinho/:idUsuario/:idProduto", (req, res) => {
  const { idUsuario, idProduto } = req.params;
  const sql = `DELETE FROM compra WHERE fk_ID_Usuario = ? AND fk_ID_Produto = ?`;
  conn.query(sql, [idUsuario, idProduto], err => {
    if (err) return res.status(500).json({ erro: err.message });
    res.sendStatus(200);
  });
});



