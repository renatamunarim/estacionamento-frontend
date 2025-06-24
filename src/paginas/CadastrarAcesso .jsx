import { useEffect, useState } from "react"
import axios from "../servicos/Api"


function CadastrarAcesso ({ onSucesso }) {
  const [placa, setPlaca] = useState("")
  const [tipo, setTipo] = useState("entrada")

  async function registrarAcesso(e) {
    e.preventDefault()

    const token = localStorage.getItem("token")

    try {
      const resposta = await axios.post("/Acessos", {
        placa,
        tipo
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      alert("Acesso registrado com sucesso!")
      setPlaca("")

    } catch (erro) {
      alert("Erro ao registrar acesso")
    }
  }

  return (
    <div>
      <h2>Cadastro de Acesso</h2>

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