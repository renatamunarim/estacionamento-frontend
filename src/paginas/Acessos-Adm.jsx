import { useEffect, useState } from "react"
import axios from "../servicos/Api"
import { useNavigate } from "react-router-dom"
import CadastrarAcesso from "./CadastrarAcesso "


function Acessos() {
    const [acessos, setAcessos] = useState([])
    const [status, setStatus] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        buscarAcessos()
        buscarStatus()
    }, [])

    async function buscarAcessos() {
        const token = localStorage.getItem("token")

        try {
            const resposta = await axios.get("/acessos", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setAcessos(resposta.data)
        } catch (erro) {
            console.error("Erro ao buscar acessos:", erro)
            alert("Erro ao carregar acessos. Faça login novamente.")
            localStorage.removeItem("token")
            navigate("/")
        }
    }

    async function buscarStatus() {
        const token = localStorage.getItem("token")

        try {
            const resposta = await axios.get("/vagas-disponiveis", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setStatus(resposta.data)
        } catch (erro) {
            console.error("Erro ao buscar status do estacionamento:", erro)
        }
    }

    function handleLogout() {
        localStorage.removeItem("token")
        navigate("/")
    }

    return (
        <div>

            <button onClick={handleLogout}>Sair</button>

            {status ? (
                <div>
                    <h3>Status do Estacionamento</h3>
                    <p>Capacidade Máxima: {status.capacidadeMaxima}</p>
                    <p>Ocupação Atual: {-status.ocupacaoAtual}</p>
                    <p><strong>Vagas Disponíveis: {status.vagasDisponiveis}</strong></p>
                </div>
            ) : (
                <p>Carregando status do estacionamento...</p>
            )}

            <CadastrarAcesso onSucesso={() => {
                buscarAcessos()
                buscarStatus()
            }} />
            <h2>Lista de Acessos</h2>
            <ul>
                {acessos.map((acesso) => (
                    <li key={acesso.id}>
                        Placa: {acesso.Veiculo?.placa} | Tipo: {acesso.tipo} | Horário:{" "}
                        {new Date(acesso.horario).toLocaleString()}
                    </li>
                ))}
            </ul>
            <button onClick={() => navigate("/relatorio-acessos")}>
                Ver Relatório de Acessos
            </button>
        </div>
    )
}

export default Acessos