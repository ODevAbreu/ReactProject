import React from 'react';
import './App.css';
import Nav from './componentes/Nav';
import Cadastro from './componentes/Cadastro';
import Login from './componentes/Login';
import Home from './componentes/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProdIncluir from './componentes/prodIncluir';
import Catalogo from './componentes/Catalogo';
import ListarUsuario from './componentes/listar_usuarios';
import CadastroEndereco from './componentes/CadastroEndereco';

function App() {
  return (
    <BrowserRouter>
      <Nav /> {/* ✅ Adicionado fora do Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/prodincluir" element={<ProdIncluir />} />
        <Route path="/prodincluir/:id" element={<ProdIncluir />} />
        <Route path="/listarUsuario" element={<ListarUsuario />} />
        <Route path="/CadastroEndereco" element={<CadastroEndereco/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
