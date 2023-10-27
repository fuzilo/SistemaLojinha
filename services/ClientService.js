import mongoose from "mongoose";

import client from "../models/Clients.js";

const Client = mongoose.model("Client", client)
class ClientService{

    //função de cadastro no banco
    Create(name, cpf, address){
        const newClient = new Client({
            name: name,
            cpf: cpf,
            address: address
        })
        newClient.save()
    }
    //função de buscar todos no banco
    GetAll(){
       const clients= Client.find()
       return clients 
    }
}

export default new ClientService()