import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./paginas/Login"
import Acessos from "./paginas/Acessos"
import PrivateRoute from "./rotas/PrivateRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/acessos"
          element={
            <PrivateRoute>
              <Acessos />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
