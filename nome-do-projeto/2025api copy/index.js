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
    password: "PUC@1234",
    database: "coffee",
    port: "3306"
});

conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

const gerarToken = (id, email) => {
    return jwt.sign({ id: id, email: email, permissoes: ['USUARIO', 'PRODUTO'] }, 'cafezera', {
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
        return res.status(401).json({ success: false, error: 'Token não fornecido' });
    }
    try {
        //verica se o token foi gerado por este servidor
        //validando a palavra chave
        const tokenValidado = validarToken(token);
        req.userId = tokenValidado.id;
        next();
    } catch (err) {
        res.status(401).json({ success: false, error: 'Token inválido' });
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
    console.log("chegou")
    const { id } = req.params;
    const sql = "SELECT nome, email, senha, Dt_Nasc, telefone, cpf FROM usuario WHERE id = ? ";
    conn.query(sql, id , (err, result) => {
        if (err) return res.status(500).json();
        res.status(200).json(result[0]);
    });
});



app.post('/api/usuario', (req, res) => {
    const usuario = req.body;

    if (usuario.id) {
        const sql = `UPDATE usuario SET nome = ?, email = ?, senha = ?, Dt_Nasc = ?, telefone = ?, cpf = ? WHERE id = ?`;
        const values = [usuario.nome, usuario.email, usuario.senha, usuario.Dt_Nasc, usuario.telefone, usuario.cpf, usuario.id];

        conn.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Erro ao atualizar", erro: err.message });
            }
            res.status(200).json({ success: true, message: "Usuário atualizado com sucesso", ...usuario });
        });

    } else {
        const sql = `INSERT INTO usuario (nome, email, senha, Dt_Nasc, telefone, cpf) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [usuario.nome, usuario.email, usuario.senha, usuario.Dt_Nasc, usuario.telefone, usuario.cpf];

        conn.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Erro de inserção", erro: err.message });
            }
            res.status(201).json({ success: true, id: result.insertId, ...usuario });
        });
    }
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

app.delete('/api/produto/:id', Autenticar, (req, res) => {
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
            res.json({ success: true, token: token, usuario: results[0] });
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

app.post('/api/endereco', Autenticar, (req, res) => {
    const endereco = req.body;
    const sql = `INSERT INTO endereco (Rua,Numero,Cidade,CEP,Bairro,fk_ID_Usuario) VALUES 
        ('${endereco.Rua}', '${endereco.Numero}', '${endereco.Cidade}', '${endereco.CEP}',
        '${endereco.Bairro}', '${endereco.fk_ID_Usuario}')`;
    conn.query(sql, (err, result) => {
        if (err) return res.status(500).json({ sucesses: false, message: "erro de inserção", erro: err.message });
        res.status(201).json({ success: true , id: result.insertId, ...endereco });
    });
});



app.put('/api/endereco/:id', Autenticar, (req, res) => {
    const id = req.params.id;
    const { Rua, Numero, Cidade, CEP, Bairro } = req.body;

    const sql = `
    UPDATE endereco
    SET Rua = ?, Numero = ?, Cidade = ?, CEP = ?, Bairro = ?
    WHERE ID_Endereco = ?`;

    conn.query(sql, [Rua, Numero, Cidade, CEP, Bairro, id], (err, result) => {
        if (err) return res.status(500).json({ sucesses: false, message: "Erro ao atualizar", erro: err.message });

        res.status(200).json({ success: true, message: "Endereço atualizado com sucesso" });
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

app.delete('/api/endereco/:id', Autenticar, (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM endereco WHERE ID_Endereco = ?';
    conn.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Erro ao excluir", erro: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Endereço não encontrado" });
        res.status(200).json({ success: true, message: "Endereço excluído com sucesso" });
    });
});



// Obtém carrinho do usuário
app.get("/api/carrinho/:idUsuario", (req, res) => {

    const idUsuario = req.params.idUsuario;

    const sql = `SELECT
                c.ID_Compra,
                p.ID_Produto,
                p.Nome_Produto,
                p.Descr_Produto,
                p.Preco_prod,
                p.Tipo_prod,
                qp.Qtn_Produto,
                p.imagem_prod
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
        res.status(200).json(result || []);
        // console.log(result);
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

app.post("/api/carrinho/adicionar", (req, res) => {
    const { idUsuario, idProduto } = req.body;

    // 1. Busca uma compra ABERTA para o cliente
    const sqlBuscaCompra = `
        SELECT ID_Compra FROM Compra
        WHERE ID_Usuario = ? AND Status = 'aberta'
        ORDER BY ID_Compra DESC LIMIT 1
    `;
    conn.query(sqlBuscaCompra, [idUsuario], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });

        let idCompra;
        if (rows.length > 0) {
            // Já existe compra aberta
            idCompra = rows[0].ID_Compra;
            verificarProdutoNoCarrinho();
        } else {
            // Não existe compra aberta, cria uma nova
            const sqlNovaCompra = `
                INSERT INTO Compra (ID_Usuario, Status)
                VALUES (?, 'aberta')
            `;
            conn.query(sqlNovaCompra, [idUsuario], (err2, result) => {
                if (err2) return res.status(500).json({ erro: err2.message });
                idCompra = result.insertId;
                verificarProdutoNoCarrinho();
            });
        }

        function verificarProdutoNoCarrinho() {
            const sqlVerifica = `
                SELECT * FROM QTD_Produto
                WHERE fk_Compra_ID_Compra = ? AND fk_Produto_ID_Produto = ?
            `;
            conn.query(sqlVerifica, [idCompra, idProduto], (err4, result) => {
                if (err4) return res.status(500).json({ erro: err4.message });
                if (result.length > 0) {
                    // Produto já está no carrinho
                    return res.status(200).json({ success: false, message: "Produto já está no carrinho" });
                }
                inserirProdutoNoCarrinho();
            });
        }

        function inserirProdutoNoCarrinho() {
            const sqlProduto = `
                INSERT INTO QTD_Produto (fk_Compra_ID_Compra, fk_Produto_ID_Produto, Qtn_Produto)
                VALUES (?, ?, 1)
            `;
            conn.query(sqlProduto, [idCompra, idProduto], (err3) => {
                if (err3) return res.status(500).json({ erro: err3.message });
                res.status(200).json({ success: true, idCompra });
            });
        }
    });
});

app.post("/api/carrinho/finalizar", Autenticar, (req, res) => {
    const { ID_Compra, idEndereco, pagamento,  idUsuario } = req.body;
    // console.log("req",req.body)
    // 1. Busca os dados do endereço
    const sqlEndereco = `
        SELECT Rua, Numero, Bairro, Cidade, CEP
        FROM endereco
        WHERE ID_Endereco = ?
    `;
    conn.query(sqlEndereco, [idEndereco], (err, enderecoResult) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (!enderecoResult || enderecoResult.length === 0)
            return res.status(404).json({ success: false, message: "Endereço não encontrado" });
        const endereco = enderecoResult[0];
        
        // 2. Busca os produtos do carrinho e seus estoques
        const sqlProdutos = `
            SELECT p.ID_Produto, p.Qtn_Produto AS estoque_atual, qp.Qtn_Produto AS qtd_solicitada, p.Nome_Produto
            FROM produto p
            JOIN qtd_produto qp ON p.ID_Produto = qp.fk_Produto_ID_Produto
            WHERE qp.fk_Compra_ID_Compra = ?
            and p.Qtn_Produto > 0
        `;
        conn.query(sqlProdutos, [ID_Compra], (err2, produtos) => {
            if (err2) return res.status(500).json({ erro: err2.message });
            

            // 3. Valida estoque
            const insuficiente = produtos.find(produto => produto.qtd_solicitada > produto.estoque_atual);

            if (insuficiente) {
                console.log("insuficiente",insuficiente)
                return res.status(400).json({
                    success: false,
                    message: `Produto '${insuficiente.Nome_Produto}' possui apenas ${insuficiente.estoque_atual} unidades em estoque, mas você solicitou ${insuficiente.qtd_solicitada}.`
                });
            }

            // 4. Atualiza a compra com dados do endereço e pagamento
            const dataAtual = new Date();
            const dataFormatada = dataAtual.toISOString().slice(0, 19).replace('T', ' ');

            const sqlUpdateCompra = `
                UPDATE compra
                SET 
                    Status = 'fechada',
                    Data_Compra = ?,
                    Forma_Pagamento = ?,
                    Rua_entrega = ?,
                    Numero_entrega = ?,
                    Bairro_entrega = ?,
                    Cidade_entrega = ?,
                    CEP_entrega = ?
                WHERE ID_Compra = ? AND ID_Usuario = ?
            `;
            conn.query(sqlUpdateCompra, [
                dataFormatada,
                pagamento,
                endereco.Rua,
                endereco.Numero,
                endereco.Bairro,
                endereco.Cidade,
                endereco.CEP,
                ID_Compra,
                idUsuario
            ], (err3, resultCompra) => {
                if (err3) return res.status(500).json({ erro: err3.message });

                // 5. Atualiza o estoque dos produtos
                const sqlUpdateEstoque = `
                    UPDATE produto
                    SET Qtn_Produto = Qtn_Produto - (
                        SELECT Qtn_Produto
                        FROM qtd_produto
                        WHERE qtd_produto.fk_Compra_ID_Compra = ? 
                          AND qtd_produto.fk_Produto_ID_Produto = produto.ID_Produto
                    )
                    WHERE ID_Produto IN (
                        SELECT fk_Produto_ID_Produto
                        FROM qtd_produto
                        WHERE fk_Compra_ID_Compra = ?
                    )
                `;
                conn.query(sqlUpdateEstoque, [ID_Compra, ID_Compra], (err4) => {
                    if (err4) return res.status(500).json({ erro: err4.message });

                    res.status(200).json({ success: true, message: "Compra finalizada com sucesso" });
                });
            });
        });
    });
});




app.put("/api/carrinho/atualizar", Autenticar, (req, res) => {
    const { ID_Compra, idProduto, Qtn_Produto } = req.body;
    const sql = `UPDATE QTD_Produto SET Qtn_Produto = ? WHERE fk_Compra_ID_Compra = ? AND fk_Produto_ID_Produto = ?`;
    conn.query(sql, [Qtn_Produto, ID_Compra, idProduto], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(200).json({ success: true, message: "Quantidade atualizada com sucesso" });
    });
});

// Remove produto do carrinho
app.delete("/api/carrinho/", Autenticar, (req, res) => {
    ID_Compra = req.body.ID_Compra;
    ID_Produto = req.body.idProduto;
    const sql = `DELETE FROM QTD_Produto WHERE fk_Compra_ID_Compra = ? AND fk_Produto_ID_Produto = ?`;
    conn.query(sql, [ID_Compra, ID_Produto], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        console.log(result)
        res.status(200).json({ success: true, message: "Produto removido do carrinho com sucesso" });
    });
});

// Histórico de compras do usuário
app.get("/api/compras/historico/:idUsuario", (req, res) => {
    const idUsuario = req.params.idUsuario;

    // Busca todas as compras fechadas do usuário
    const sqlCompras = `
        SELECT * FROM compra
        WHERE ID_Usuario = ? AND Status = 'fechada'
        ORDER BY Data_Compra DESC
    `;
    conn.query(sqlCompras, [idUsuario], (err, compras) => {
        if (err) return res.status(500).json({ erro: err.message });

        if (!compras.length) return res.json([]);

        // Para cada compra, busca os produtos
        const comprasComProdutos = [];
        let pendentes = compras.length;

        compras.forEach((compra, idx) => {
            const sqlProdutos = `
                SELECT 
                    p.ID_Produto, p.Nome_Produto, p.Preco_prod, p.imagem_prod,
                    qp.Qtn_Produto,
                    (qp.Qtn_Produto * p.Preco_prod) as Subtotal
                FROM qtd_produto qp
                JOIN produto p ON p.ID_Produto = qp.fk_Produto_ID_Produto
                WHERE qp.fk_Compra_ID_Compra = ?
            `;
            conn.query(sqlProdutos, [compra.ID_Compra], (err2, produtos) => {
                if (err2) return res.status(500).json({ erro: err2.message });

                // Calcula total da compra
                const total = produtos.reduce((acc, prod) => acc + Number(prod.Subtotal), 0);

                comprasComProdutos[idx] = {
                    ...compra,
                    produtos,
                    total
                };

                pendentes--;
                if (pendentes === 0) {
                    // Ordena por data (opcional)
                    comprasComProdutos.sort((a, b) => new Date(b.Data_Compra) - new Date(a.Data_Compra));
                    res.json(comprasComProdutos);
                }
            });
        });
    });
});



