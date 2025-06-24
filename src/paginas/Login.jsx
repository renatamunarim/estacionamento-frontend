import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../servicos/Api"

function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const resposta = await axios.post("/login", {
        email,
        senha
      })
       const { token, tipo } = resposta.data

      localStorage.setItem("token", resposta.data.token)
      localStorage.setItem("tipo", resposta.data.tipo)      
      alert("Login realizado com sucesso")


      if (tipo === "administrador") {
        navigate("/acessos-adm")
      } else {
        navigate("/acessos-geral")
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
    <div>
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Entrar</button>
      <p>Não tem uma conta?</p>
      <button onClick={() => navigate("/cadastro")}>Cadastre-se</button>
    </div>
  )
}

export default Login