import "./Acessos-Adm.css"
import estrada from "../assets/estradinha.png"
import logo from "../assets/estacionamento.png"
import rodape from "../assets/senai.png"
import { useState, useEffect } from "react"
import axios from "../servicos/Api"
import { useNavigate } from "react-router-dom"

function AcessosAdm() {
  const [placa, setPlaca] = useState("")
  const [tipo, setTipo] = useState("entrada")
  const [status, setStatus] = useState(null)
  const [lotado, setLotado] = useState(false)
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
      await verificarStatusEstacionamento()
      await buscarStatus()
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

  async function verificarStatusEstacionamento() {
    const token = localStorage.getItem("token")
    try {
      const resposta = await axios.get("/vagas-disponiveis", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const { ocupacaoAtual, capacidadeMaxima } = resposta.data
      setLotado(ocupacaoAtual >= capacidadeMaxima)
    } catch (erro) {
      console.error("Erro ao verificar status do estacionamento")
    }
  }

  function handleLogout() {
    localStorage.removeItem("token")
    navigate("/")
  }

  useEffect(() => {
    buscarStatus()
    verificarStatusEstacionamento()
  }, [])


  return (
    <div className="adm-container">
      <img src={estrada} alt="Estrada" className="img-estrada" />

      <div className="topo">
        <img src={logo} alt="Logo Estacionamento" className="cadastro-logo" />

        <div className="saudacao">
          <p id="ola">Olá, <span>Admin</span> </p>
          <button className="adm-botao-sair" onClick={handleLogout}>Sair?</button>
        </div>

      </div>

      <div className="lotado">{lotado && <p id="lotado">ESTACIONAMENTO LOTADO!</p>}</div>

      <div className="adm-cadastrar-acesso">
        <h2 id="adm-acesso-titulo">Cadastrar acesso</h2>
        <form onSubmit={registrarAcesso}>
          <div id="adm-formulario-acesso">
            <input
              className="input-acesso"
              type="text"
              placeholder="Placa"
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              required
            />
            <select className="select-acesso" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </div>
        </form>
        <button className="adm-botao-registrar" type="submit">Registrar</button>
      </div>


      {status ? (
        <div className="status-estacionamento">
          <div>Vagas disponíveis <span className="status"> {status.capacidadeMaxima}</span></div>
          <div><span className="status">{status.ocupacaoAtual}</span> Ocupação atual</div>
        </div>
      ) : (
        <p>Carregando status...</p>
      )}
      <div className="div-relatorio">
        <button className="adm-botao-relatorio" onClick={() => navigate("/relatorio-acessos")}>
          RELATÓRIO DE ACESSOS
        </button>
      </div>
      <img src={rodape} alt="SENAI" className="rodape" />
    </div>
  )
}

export default AcessosAdm
