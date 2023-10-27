import mongoose from "mongoose"
//inportar a classe service
//definir a estrutura de dados
//nome, cpf e endereço

const client = new mongoose.Schema(
    {
        name: String,
        cpf: String,
        address: String
    }
)


export default client 