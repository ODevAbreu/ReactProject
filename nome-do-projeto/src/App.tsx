import React from 'react';
import './App.css';
import Nav from './componentes/Nav';
import Cadastro from './componentes/Cadastro';
import Login from './componentes/Login';
import Home from './componentes/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProdIncluir from './componentes/prodIncluir';
import Catalogo from './componentes/Catalogo';
function App() {
  return (
   
    <BrowserRouter>
    
      <Routes>
        <Route path="/catalogo" element={<Catalogo />} />
            {/* <Route path="/usuario/:id" element={<Usuario />} /> */}
       {/* <Route path="/prodIncluir" element={<ProdIncluir />} /> */}

      </Routes>
      <Home></Home>
    </BrowserRouter>


    // <ProdIncluir></ProdIncluir>
  );
}

export default App;
