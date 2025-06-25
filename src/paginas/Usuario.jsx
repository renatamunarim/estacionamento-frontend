import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../servicos/Api"

function Usuario() {
  const [perfil, setPerfil] = useState(null)
  const [veiculos, setVeiculos] = useState([])
  const [acessos, setAcessos] = useState([])
  const [editandoVeiculoId, setEditandoVeiculoId] = useState(null)
  const [novoVeiculo, setNovoVeiculo] = useState({ placa: "", modelo: "", cor: "" })
  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  useEffect(() => {
    buscarTudo()
  }, [])

  async function buscarTudo() {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const [resPerfil, resVeiculos, resAcessos] = await Promise.all([
        axios.get("/perfil", config),
        axios.get("/veiculos", config),
        axios.get("/acessos", config),
      ])

      setPerfil(resPerfil.data)
      setVeiculos(resVeiculos.data)
      setAcessos(resAcessos.data)
    } catch (erro) {
      alert("Erro ao carregar dados")
      console.error(erro)
      navigate("/")
    }
  }

  function handleLogout() {
    localStorage.removeItem("token")
    navigate("/")
  }

  async function excluirPerfil() {
    if (!window.confirm("Deseja realmente excluir seu perfil?")) return
    try {
      await axios.delete(`/usuario/${perfil.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert("Perfil excluído")
      handleLogout()
    } catch (erro) {
      alert("Erro ao excluir perfil")
    }
  }
  async function adicionarVeiculo() {
    if (!novoVeiculo.placa || !novoVeiculo.modelo || !novoVeiculo.cor) return alert("Preencha todos os campos")
    try {
      await axios.post("/veiculos", novoVeiculo, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNovoVeiculo({ placa: "", modelo: "", cor: "" })
      buscarTudo()
    } catch (erro) {
      alert("Erro ao adicionar veículo")
    }
  }

  async function excluirVeiculo(id) {
    if (!window.confirm("Excluir este veículo?")) return
    try {
      await axios.delete(`/veiculos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      buscarTudo()
    } catch (erro) {
      alert("Erro ao excluir veículo")
    }
  }

  async function salvarEdicaoVeiculo(id) {
    try {
      const veiculo = veiculos.find(v => v.id === id)
      await axios.put(`/veiculos/${id}`, {
        placa: veiculo.placa,
        modelo: veiculo.modelo
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEditandoVeiculoId(null)
      buscarTudo()
    } catch (erro) {
      alert("Erro ao editar veículo")
    }
  }

  function atualizarCampoVeiculo(id, campo, valor) {
    setVeiculos(prev =>
      prev.map(v =>
        v.id === id ? { ...v, [campo]: valor } : v
      )
    )
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Olá, {perfil?.nome}</h2>

      <button onClick={handleLogout}>Sair</button>
      <button onClick={excluirPerfil} style={{ marginLeft: "10px", background: "red", color: "white" }}>
        Excluir Perfil
      </button>

      <hr />

      <h3>Meus Veículos</h3>
      <ul>
        {veiculos.map(veiculo => (
          <li key={veiculo.id}>
            {editandoVeiculoId === veiculo.id ? (
              <>
                <input
                  value={veiculo.placa}
                  onChange={(e) => atualizarCampoVeiculo(veiculo.id, "placa", e.target.value)}
                />
                <input
                  value={veiculo.modelo}
                  onChange={(e) => atualizarCampoVeiculo(veiculo.id, "modelo", e.target.value)}
                />
                                <input
                  value={veiculo.cor}
                  onChange={(e) => atualizarCampoVeiculo(veiculo.id, "cor", e.target.value)}
                />
                <button onClick={() => salvarEdicaoVeiculo(veiculo.id)}>Salvar</button>
                <button onClick={() => setEditandoVeiculoId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                {veiculo.placa} - {veiculo.modelo}
                <button onClick={() => setEditandoVeiculoId(veiculo.id)}>Editar</button>
                <button onClick={() => excluirVeiculo(veiculo.id)}>Excluir</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h4>Adicionar novo veículo</h4>
      <input
        placeholder="Placa"
        value={novoVeiculo.placa}
        onChange={(e) => setNovoVeiculo({ ...novoVeiculo, placa: e.target.value })}
      />
      <input
        placeholder="Modelo"
        value={novoVeiculo.modelo}
        onChange={(e) => setNovoVeiculo({ ...novoVeiculo, modelo: e.target.value })}
      />
      <input
        placeholder="Cor"
        value={novoVeiculo.cor}
        onChange={(e) => setNovoVeiculo({ ...novoVeiculo, cor: e.target.value })}
      />
      <button onClick={adicionarVeiculo}>Adicionar</button>

      <hr />

      <h3>Meus Acessos</h3>
      <ul>
        {acessos.map(acesso => (
          <li key={acesso.id}>
            Tipo: {acesso.tipo} | Horário: {new Date(acesso.horario).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Usuario