import { useEffect, useState } from "react"
import axios from "../servicos/Api"
import { useNavigate } from "react-router-dom"
import CadastrarAcesso from "./CadastrarAcesso "

function Acessos() {
    const [acessos, setAcessos] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        buscarAcessos()
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

    function handleLogout() {
        localStorage.removeItem("token")
        navigate("/")
    }
    return (
        <div>
            <h2>Lista de Acessos</h2>
            <button onClick={handleLogout}>Sair</button>
            <CadastrarAcesso onSucesso={buscarAcessos} />
            <ul>
                {acessos.map((acesso) => (
                    <li key={acesso.id}>
                        Placa: {acesso.Veiculo?.placa} | Tipo: {acesso.tipo} | Horário:{" "}
                        {new Date(acesso.horario).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Acessos