import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Inputmask from "inputmask";
import { useParams } from "react-router-dom";
import enderecoService from "../service/EnderecoService";
import { useNavigate } from "react-router-dom";
const EditarEndereco = () => {
  const navigate = useNavigate();
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const { id } = useParams(); // <- vindo da rota tipo /editar-endereco/:id

  useEffect(() => {
    Inputmask("99999-999").mask(document.getElementById("cep") as HTMLInputElement);

    // Carregar dados existentes usando o serviço
    enderecoService.buscarPorId(id as string)
      .then((data) => {
        setCep(data.CEP || '');
        setRua(data.Rua || '');
        setNumero(data.Numero || '');
        setBairro(data.Bairro || '');
        setCidade(data.Cidade || '');
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Erro ao carregar endereço",
          text: err.message
        });
      });
}, [id]);

  const buscarCep = () => {
    const cepLimpo = cep.replace("-", "");
    if (cepLimpo.length !== 8) {
      Swal.fire({
        icon: "warning",
        title: "CEP inválido",
        text: "O CEP deve conter exatamente 8 dígitos."
      });
      return;
    }

    fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.erro) {
          Swal.fire({
            icon: "error",
            title: "CEP não encontrado",
            text: "Verifique se o CEP está correto."
          });
          return;
        }
        setRua(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Erro ao buscar o CEP",
          text: err.message
        });
      });
  };

  const atualizarEndereco = () => {
    const enderecoAtualizado = {
      CEP: cep,
      Rua: rua,
      Numero: numero,
      Bairro: bairro,
      Cidade: cidade
    };

    enderecoService.atualizar(Number(id), enderecoAtualizado)
      .then(() => {
        sessionStorage.setItem("enderecoAtualizado", "true");
        Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Endereço atualizado com sucesso!"
        }).then((result) => {
            if (result.isConfirmed) {
              navigate("/carrinho");
            }
          });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Erro ao atualizar",
          text: "Não foi possível atualizar o endereço."
        });
      });
  };

  return (
    <section className="vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-12 col-lg-9">
            <div className="card p-4" style={{ borderRadius: "1rem" }}>
              <div className="card-body text-black">
                <h1 className="fw-bold text-center mb-4">Editar Endereço</h1>
                <form>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="cep">CEP</label>
                    <input
                      type="text"
                      id="cep"
                      className="form-control"
                      required
                      pattern="\d{5}-\d{3}"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      onBlur={buscarCep}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="rua">Rua</label>
                    <input
                      type="text"
                      id="rua"
                      className="form-control"
                      required
                      value={rua}
                      onChange={(e) => setRua(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="numero">Número</label>
                    <input
                      type="text"
                      id="numero"
                      className="form-control"
                      required
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="bairro">Bairro</label>
                    <input
                      type="text"
                      id="bairro"
                      className="form-control"
                      required
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="cidade">Cidade</label>
                    <input
                      type="text"
                      id="cidade"
                      className="form-control"
                      required
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                    />
                  </div>
                  <div className="d-grid mt-4">
                    <button className="btn btn-dark btn-custom" type="button"
                      onClick={atualizarEndereco}>Atualizar</button>
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

export default EditarEndereco;
