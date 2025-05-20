import React, { useEffect, useState } from "react";
import './style.css';
import { useForm } from "react-hook-form";
import { useParams, useNavigate  } from "react-router-dom";
import prodService from "../service/ProdService";

const ProdIncluir: React.FC = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [descr, setDescr] = useState('');
  const [tipo, setTipo] = useState('');
  const [preco, setPreco] = useState(0);
  const [qtd, setQtd] = useState(0);
  const [imagemPath, setImagemPath] = useState('');

  const {id} = useParams();

  useEffect(() => {        
    if (id) {
        prodService.buscarPorId(id).then(produtos => {
            setNome(produtos.Nome_Produto);
            setDescr(produtos.Descr_Produto);
            setTipo(produtos.Tipo_prod);
            setPreco(produtos.Preco_prod);
            setQtd(produtos.Qtn_Produto);
            setImagemPath(produtos.imagem_prod || '');
        });
    }        
  },[id]);

  const salvar = () => {  
    prodService.salvar({
      id:id,  
      nome: nome,
      descr: descr,
      tipo: tipo,
      preco: preco,
      qtd: qtd,
      imagem: imagemPath
    }).then(result => {
      navigate('/Catalogo');
    }, error => {
      console.log(error);
    });
  }

  const handleUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) {
        console.log('Por favor, selecione um arquivo');
        return;
    }

    prodService.uploadFile(file).then((result: any) => {
        if (result.path) {
            setImagemPath(result.path);
            console.log("Imagem enviada com sucesso:", result.path);
        }
    });
  }

  return (
    <section className="vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-12 col-lg-9">
            <div className="card p-4" style={{ borderRadius: "1rem" }}>
              <div className="card-body text-black">
                <h1 className="fw-bold text-center mb-4">Cadastro de Produto</h1>
                <form className="w3-container">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="nome_prod">Nome do Produto</label>
                    <input type="text" id="nome_prod" className="form-control" required minLength={5} value={nome} onChange={(e) => setNome(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="descr_prod" className="form-label">Descrição do Produto</label>
                    <textarea className="form-control" id="descr_prod" rows={2} value={descr} onChange={(e) => setDescr(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="tipo_prod">Tipo Produto</label>
                    <select id="tipo_prod" className="form-select" required value={tipo} onChange={(e) => setTipo(e.target.value)}>
                      <option value="">Selecione o tipo do produto</option>
                      <option>Bebida</option>
                      <option>Pó</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="preco_prod">Preço do Produto</label>
                    <input type="number" id="preco_prod" className="form-control" step="0.01" required value={preco} onChange={(e) => setPreco(parseFloat(e.target.value))} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="qtd_prod">Quantidade em estoque</label>
                    <input type="number" id="qtd_prod" className="form-control" required value={qtd} onChange={(e) => setQtd(parseInt(e.target.value))} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Upload de arquivo</label>
                    <input type="file" className="form-control" onChange={handleUpload} />
                  </div>
                  {imagemPath && (
                    <div className="mb-3">
                      <img src={imagemPath} alt="preview" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                  )}
                  <div className="d-grid mt-4">
                    <button className="btn btn-dark btn-custom" type="button" onClick={salvar} id="btnCadastrar">Cadastrar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProdIncluir;