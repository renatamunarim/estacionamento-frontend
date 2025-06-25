import { useState, useEffect } from "react"
import axios from "../servicos/Api"
import { useNavigate } from "react-router-dom"

function AcessosAdm() {
  const [placa, setPlaca] = useState("")
  const [tipo, setTipo] = useState("entrada")
  const [status, setStatus] = useState(null)
  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  async function registrarAcesso(e) {
    e.preventDefault()

    try {
      const resposta = await axios.post("/acessos-adm", { placa, tipo }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      alert("Acesso registrado com sucesso!")
      setPlaca("")
      buscarStatus()
    } catch (err) {
      console.error("Erro ao registrar acesso:", err.response?.data || err.message)
      alert("Erro ao registrar acesso")
    }
  }

  async function buscarStatus() {
    try {
      const resposta = await axios.get("/vagas-disponiveis", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setStatus(resposta.data)
    } catch (erro) {
      console.error("Erro ao buscar status:", erro)
    }
  }

  function handleLogout() {
    localStorage.removeItem("token")
    navigate("/")
  }

  useEffect(() => {
    buscarStatus()
  }, [])

  return (
    <div>
      <button onClick={handleLogout}>Sair</button>

      <h2>Cadastro de Acesso</h2>
      <form onSubmit={registrarAcesso}>
        <input
          type="text"
          placeholder="Placa"
          value={placa}
          onChange={(e) => setPlaca(e.target.value.toUpperCase())}
          required
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
        <button type="submit">Registrar</button>
      </form>

      {status ? (
        <div>
          <h3>Status do Estacionamento</h3>
          <p>Capacidade: {status.capacidadeMaxima}</p>
          <p>Ocupação atual: {status.ocupacaoAtual}</p>
          <p><strong>Vagas disponíveis: {status.vagasDisponiveis}</strong></p>
        </div>
      ) : (
        <p>Carregando status...</p>
      )}
                <button onClick={() => navigate("/relatorio-acessos")}>
                Ver Relatório de Acessos
            </button>
    </div>
  )
}

export default AcessosAdm