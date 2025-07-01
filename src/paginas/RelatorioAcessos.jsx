import "./RelatorioAcessos.css"
import logo from "../assets/estacionamento.png"
import estrada from "../assets/estradinha.png"
import rodape from "../assets/senai.png"
import { useEffect, useState } from "react"
import axios from "../servicos/Api"
import { useNavigate } from "react-router-dom"

function RelatorioAcessos() {
  const [acessos, setAcessos] = useState([])
  const navigate = useNavigate()

  async function buscarRelatorio() {
    try {
      const token = localStorage.getItem("token")
      const resposta = await axios.get("/relatorio-acessos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setAcessos(resposta.data)
    } catch (erro) {
      console.error("Erro ao buscar relatório:", erro)
    }
  }

  function handleLogout() {
    localStorage.removeItem("token")
    navigate("/")
  }

  useEffect(() => {
    buscarRelatorio()
  }, [])

  function exportarCSV() {
    const linhas = acessos.map((acesso) =>
      [
        acesso.veiculo?.usuario?.nome || "",
        acesso.veiculo?.placa || "",
        acesso.tipo,
        new Date(acesso.horario).toLocaleString(),
      ].join(",")
    )

    const csv = ["Nome do Usuário,Placa,Tipo,Horário", ...linhas].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "relatorio_acessos.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="rel-container">
      <img src={estrada} alt="Estrada" className="img-estrada" />

      <div className="topo">
        <img src={logo} alt="Logo Estacionamento" className="cadastro-logo" />

        <div className="saudacao">
          <p id="ola">Olá, <span>Admin</span> </p>
          <button className="rel-botao-sair" onClick={handleLogout}>Sair?</button>
        </div>

      </div>
      <h2 className="titulo" >Relatório de Acessos</h2>


      <table className="relatorio-tabela" >
        <thead>
          <tr>
            <th>Nome</th>
            <th>Placa</th>
            <th>Tipo</th>
            <th>Horário</th>
          </tr>
        </thead>
        <tbody>
          {acessos.map((acesso) => (
            <tr key={acesso.id}>
              <td>{acesso.veiculo?.usuario?.nome}</td>
              <td>{acesso.veiculo?.placa}</td>
              <td>{acesso.tipo}</td>
              <td>{new Date(acesso.horario).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="div-botao-exportar">
        <button className="rel-botao-exportar" onClick={exportarCSV}>EXPORTAR</button>
      </div >
      <img src={rodape} alt="SENAI" className="rodape" />
    </div>
  )
}

export default RelatorioAcessos