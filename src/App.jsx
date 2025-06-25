import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./paginas/Login"
import AcessosAdm from "./paginas/Acessos-Adm"
import PrivateRoute from "./rotas/PrivateRoute"
import RelatorioAcessos from "./paginas/RelatorioAcessos"
import Cadastro from "./paginas/Cadastro"
import Usuario from "./paginas/Usuario"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/acessos-adm" element={<PrivateRoute><AcessosAdm /></PrivateRoute>} />
        <Route path="/usuario" element={
          <PrivateRoute>
            <Usuario />
          </PrivateRoute>
        } />
        <Route path="/relatorio-acessos" element={<RelatorioAcessos />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
