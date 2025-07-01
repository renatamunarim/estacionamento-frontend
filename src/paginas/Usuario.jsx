import "./Usuario.css"
import estrada from "../assets/estradinha.png"
import logo from "../assets/estacionamento.png"
import rodape from "../assets/senai.png"
import salvar from "../assets/salvar.png"
import excluir from "../assets/excluir.png"
import editar from "../assets/editar.png"
import cancelar from "../assets/cancelar.png"
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
        modelo: veiculo.modelo,
        cor: veiculo.cor
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
    <div className="adm-container">
      <img src={estrada} alt="Estrada" className="img-estrada" />

      <div className="topo">
        <img src={logo} alt="Logo Estacionamento" className="cadastro-logo" />
        <div className="saudacao">
          <p id="ola">Olá, <span>{perfil?.nome}</span></p>
          <button className="usu-botao-sair" onClick={handleLogout}>Sair</button>
        </div>
      </div>

      <div className="container-usuario">
        <div className="secao">
          <h2 className="titulo-secao" >Meus Veículos</h2>
          <ul className="ul-veiculos">
            {veiculos.map(veiculo => (
              <li className="li-veiculos" key={veiculo.id}>
                {editandoVeiculoId === veiculo.id ? (
                  <div className="itens-lista-veiculos">
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
                    <div className="botoes-edicao-veiculos">
                      <button className="usu-botao" onClick={() => salvarEdicaoVeiculo(veiculo.id)}>
                        <img className="usu-img-botao" src={salvar} alt="Salvar" />
                      </button>
                      <button className="usu-botao" onClick={() => setEditandoVeiculoId(null)}>
                        <img className="usu-img-botao" src={cancelar} alt="Cancelar" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="botoes-edicao-veiculos">

                    <button className="usu-botao" onClick={() => setEditandoVeiculoId(veiculo.id)}>
                      <img className="usu-img-botao" src={editar} alt="Editar" />
                    </button>
                    <button className="usu-botao" onClick={() => excluirVeiculo(veiculo.id)}>
                      <img className="usu-img-botao" src={excluir} alt="Excluir" />
                    </button>
                    <span id="veiculos-cadastrado">{veiculo.placa} - {veiculo.modelo}</span>
                  </div>

                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="secao">
          <h2 className="titulo-secao">Meus Acessos</h2>
          <ul className="lista-acessos">
            {acessos.map(acesso => (
              <li key={acesso.id}>
                {new Date(acesso.horario).toLocaleString()} | {acesso.tipo}
              </li>
            ))}
          </ul>
        </div>
      </div>


      <div className="form-cadastro">
        <div className="div-cadastro-botao">
          <h2 className="titulo-cadastrar">Cadastrar novo veículo</h2>
          <button className="botao-adicionar" onClick={adicionarVeiculo}>ADICIONAR</button>
        </div>
        <div className="div-cadastro">
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
        </div>
        <div>
          <button className="usu-botao-excluir-perfil" onClick={excluirPerfil}>
            Excluir conta?
          </button>
        </div>
      </div>

      <img src={rodape} alt="SENAI" className="rodape" />
    </div>
  )
}

export default Usuario