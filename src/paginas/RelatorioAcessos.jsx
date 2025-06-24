import { useEffect, useState } from "react"
import axios from "../servicos/Api"

function RelatorioAcessos() {
  const [acessos, setAcessos] = useState([])
  const [usuarioFiltro, setUsuarioFiltro] = useState("")
  const [placaFiltro, setPlacaFiltro] = useState("")

  async function buscarRelatorio() {
    try {
      const token = localStorage.getItem("token")
      const resposta = await axios.get(`/relatorio-acessos`, {
        params: {
          usuario: usuarioFiltro,
          placa: placaFiltro,
        },
        headers: { Authorization: `Bearer ${token}` },
      })
      setAcessos(resposta.data)
    } catch (erro) {
      console.error("Erro ao buscar relatório:", erro)
    }
  }

  useEffect(() => {
    buscarRelatorio()
  }, [usuarioFiltro, placaFiltro])

  function exportarCSV() {
    const linhas = acessos.map((acesso) =>
      [
        acesso.usuario?.nome || "",
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
    <div>
      <h2>Relatório de Acessos</h2>


      <button onClick={exportarCSV}>Exportar CSV</button>

      <table border="1">
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
              <td>{acesso.usuario?.nome}</td>
              <td>{acesso.veiculo?.placa}</td>
              <td>{acesso.tipo}</td>
              <td>{new Date(acesso.horario).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RelatorioAcessos