import { useState } from "react"
import axios from "../servicos/Api"

function CadastrarAcesso ({ onSucesso }) {
    const [vagas, setVagas] = useState(null)
  const [placa, setPlaca] = useState("")
  const [tipo, setTipo] = useState("entrada")

    useEffect(() => {
    buscarVagas()
  }, [])

  async function buscarVagas() {
    const token = localStorage.getItem("token")
    try {
      const resposta = await axios.get("/relatorio-vagas", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setVagas(resposta.data)
    } catch (erro) {
      alert("Erro ao buscar vagas.")
    }
  }

  async function registrarAcesso(e) {
    e.preventDefault()

    const token = localStorage.getItem("token")

    try {
      const resposta = await axios.post("/acessos", {
        placa,
        tipo
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      alert("Acesso registrado com sucesso!")
      setPlaca("")
      setTipo("entrada")
      if (onSucesso) onSucesso() // para recarregar a lista
    } catch (erro) {
      console.error("Erro ao registrar acesso:", erro)
      alert("Erro ao registrar acesso.")
    }
  }

  return (
    <div>
      <h2>Cadastro de Acesso</h2>

      {vagas && (
        <div style={{ marginBottom: "1rem" }}>
          <strong>Capacidade:</strong> {vagas.capacidadeMaxima} <br />
          <strong>Ocupadas:</strong> {vagas.ocupacaoAtual} <br />
          <strong>Disponíveis:</strong> {vagas.vagasDisponiveis}
        </div>
      )}
    <form onSubmit={registrarAcesso}>
      <h3>Registrar Acesso</h3>
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
    </div>
  )
}

export default CadastrarAcesso 