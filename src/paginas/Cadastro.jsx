import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../servicos/Api"

function Cadastro() {
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [cpf, setCpf] = useState("")
    const [telefone, setTelefone] = useState("")
    const [senha, setSenha] = useState("")
    const [tipo, setTipo] = useState("")
    const navigate = useNavigate()

    const handleCadastro = async (e) => {
        e.preventDefault()

        try {
            await axios.post("/cadastro", {
                nome,
                email,
                cpf,
                telefone,
                senha,
                tipo,
            })

            alert("Cadastro realizado com sucesso!")
            navigate("/")
        } catch (erro) {
            console.error("Erro ao cadastrar:", erro)
            alert("Erro ao cadastrar. Verifique os dados e tente novamente.")
        }
    }

    return (
        <div>
            <h2>Cadastro de Usuário</h2>
            <form onSubmit={handleCadastro}>
                <input
                    type="text"
                    placeholder="Nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
                <br />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />
                <input
                    type="text"
                    placeholder="CPF"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                />
                <br />
                <input
                    type="text"
                    placeholder="Telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />
                <br />
                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    required
                >
                    <option value="">Selecione o tipo</option>
                    <option value="aluno">Aluno</option>
                    <option value="professor">Professor</option>
                    <option value="funcionario">Funcionário</option>
                    <option value="administrador">Administrador</option>
                </select>
                <br />
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    )
}

export default Cadastro