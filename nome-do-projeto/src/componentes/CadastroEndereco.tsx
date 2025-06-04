import React, { useState } from "react";
import enderecoService from "../service/EnderecoService"; 



const CadastroEndereco = () => {
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');

  const Cadastrar = () => {
    const user = localStorage.getItem("usuario");
    if (user){
      const usuarioObj = JSON.parse(user);
      const usuarioId = usuarioObj.Id
    
    if (!usuarioId) {
      alert("Usuário não identificado. Faça login novamente.");
      return;
    }
     

    const endereco = {
      CEP: cep,
      Rua: rua,
      Numero: numero,
      Bairro: bairro,
      Cidade: cidade,
      fk_ID_Usuario: usuarioId
    };

    enderecoService.salvar(endereco)
      .then(() => {
        alert("Endereço cadastrado com sucesso!");
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao cadastrar endereço");
      });
     }
  };
   
 
  return (
    <section className="vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-12 col-lg-9">
            <div className="card p-4" style={{ borderRadius: "1rem" }}>
              <div className="card-body text-black">
                <h1 className="fw-bold text-center mb-4">Cadastro de Endereço</h1>
                <form className="w3-container">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="cep">CEP</label>
                    <input type="text" id="cep" className="form-control" required
                      pattern="\d{5}-\d{3}" placeholder="00000-000"
                      value={cep} onChange={(e) => setCep(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="rua">Rua</label>
                    <input type="text" id="rua" className="form-control" required minLength={3}
                      value={rua} onChange={(e) => setRua(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="numero">Número</label>
                    <input type="text" id="numero" className="form-control" required
                      value={numero} onChange={(e) => setNumero(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="bairro">Bairro</label>
                    <input type="text" id="bairro" className="form-control" required
                      value={bairro} onChange={(e) => setBairro(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="cidade">Cidade</label>
                    <input type="text" id="cidade" className="form-control" required
                      value={cidade} onChange={(e) => setCidade(e.target.value)} />
                  </div>
                  <div className="d-grid mt-4">
                    <button className="btn btn-dark btn-custom" type="button" id="btnCadastrar"
                      onClick={Cadastrar}>Cadastrar</button>
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

export default CadastroEndereco;
