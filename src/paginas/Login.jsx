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

      localStorage.setItem("token", resposta.data.token)
      alert("Login realizado com sucesso")
      navigate("/acessos")
    } catch (erro) {
      if (erro.response && erro.response.data && erro.response.data.mensagem) {
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
    </div>
  )
}

export default Login