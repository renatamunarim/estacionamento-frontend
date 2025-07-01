import "./Login.css"
import estrada from "../assets/estradinha.png"
import logo from "../assets/estacionamento.png"
import rodape from "../assets/senai.png"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../servicos/Api"


function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const resposta = await axios.post("/login", { email, senha })

      const token = resposta.data.token
      const tipo = resposta.data.usuario.tipo

      localStorage.setItem("token", token)
      localStorage.setItem("tipo", tipo)

      alert("Login realizado com sucesso")

      if (tipo === "admin") {
        navigate("/acessos-adm")
      } else {
        navigate("/usuario")
      }

    } catch (erro) {
      if (erro.response?.data?.mensagem) {
        alert(erro.response.data.mensagem)
      } else {
        alert("Erro desconhecido")
        console.log(erro)
      }
    }
  }

  return (
    <div className="login-container">
            <img src={estrada} alt="Estrada" className="img-estrada" />
      <div className="login-content">
        <img src={logo} alt="Logo Estacionamento" className="login-logo" />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button className="login-botao-cadastre-se"onClick={() => navigate("/cadastro")}>Cadastre-se</button>
        <button className="login-botao-entrar" onClick={handleLogin}>Entrar</button>
      </div>
            <img src={rodape} alt="SENAI" className="rodape" />
    </div>
  )
}

export default Login