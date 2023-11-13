import express from 'express' // Importando o Express
const app = express() // Iniciando o Express
//importando o mongoose
import mongoose from 'mongoose'

//importando o body parser
import bodyParser from 'body-parser'
//inportar a classe service
import ClientService from './services/ClientService.js'
import OrderService from './services/OrderService.js'
import ProductService from './services/ProductService.js'

//decodifica dados recebidos por formulários
app.use(bodyParser.urlencoded({extended:false}))

//permite a utilização de dados via json
app.use(bodyParser.json())

//criando conexão com o banco
mongoose.connect("mongodb://127.0.0.1:27017/loja", {useNewUrlParser:true, useUnifiedTopology:true}) 


// Define o EJS como Renderizador de páginas
app.set('view engine', 'ejs')

//Indicando ao express a pasta public para arquivos estáticos
app.use(express.static("public"))

// ROTA PRINCIPAL
app.get("/",function(req,res){
    res.render("index")
})

//rota para clientes

app.get("/clientes",(req,res)=> {
    ClientService.GetAll().then(clients => {
        res.render("clientes", {
            clients : clients
        })
        
    })
})

//Criando Rota do tipo POST
app.post("/createClient",(req, res) => {
    ClientService.Create(
        req.body.name,
        req.body.cpf,
        req.body.address
    )
    res.redirect("/clientes")
})

//Criando Rota do tipo Find Client
app.get("/findClient/:id", (req, res) => {
    const id = req.params.id
    ClientService.GetOne(id).then(Client => {
        res.render("dadoscliente", {
            Client : Client
        })
    })
})

//Criando Rota do tipo Update Client
app.post("/updateClient/:id", (req, res) => {
    ClientService.Update(
        req.body.id,
        req.body.name,
        req.body.cpf,
        req.body.address
    )
    res.redirect("/clientes")
})

//Criando Rota do Tipo Delete Client
app.get("/deleteClient/:id", (req, res) => {
    const id = req.params.id
    ClientService.Delete(id)
    res.redirect("/clientes")  
})

//Rotas para produtos
app.get("/produtos",(req,res)=>{
    ProductService.GetAll().then(products=>{
        res.render("produtos",{
            products:products
        })
    } )
})

app.post("/createProduct", (req,res) =>{
    ProductService.Create(
        req.body.name,
        req.body.price,
        req.body.category
    )
    res.redirect("/produtos")
})

//rota do tipo excluir produto
app.get("/deleteProduct/:id", (req, res) => {
    const id = req.params.id
    ProductService.Delete(id)
    res.redirect("/produtos")  
})

// Rota do tipo buscar produto
app.get("/findProduct/:id", (req, res) => {
    const id = req.params.id
    ProductService.GetOne(id).then(Product => {
        res.render("dadosproduto", {
            Product : Product
        })
    })
})
// Rota do tipo alterar produto
app.post("/updateProduct/:id", (req, res) => {
    ProductService.Update(
        req.body.id,
        req.body.name,
        req.body.price,
        req.body.category
    )
    res.redirect("/produtos")
})


//Rotas para Pedidos

app.get("/pedidos",(req,res)=> {
    OrderService.GetAll().then(orders =>{
        res.render("pedidos",{
            orders:orders
        })
    })
})

app.post("/createOrder", (req,res)=>{
    OrderService.Create(
        req.body.code,
        req.body.total
    )
    res.redirect("/pedidos")
})

//Rota para buscar Pedido
app.get("/findOrder/:id", (req, res) => {
    const id = req.params.id
    OrderService.GetOne(id).then(Order => {
        res.render("dadospedido", {
            Order : Order
        })
    })
})

//Rota para Excluir Pedido
app.get("/deleteOrder/:id", (req, res) => {
    const id = req.params.id
    OrderService.Delete(id)
    res.redirect("/pedidos")  
})

//Rota para alterar pedido
app.post("/updateOrder/:id", (req, res) => {
    OrderService.Update(
        req.body.id,
        req.body.code,
        req.body.total
    )
    res.redirect("/pedidos")
})

// ROTA CLIENTES
app.get("/clientes",function(req,res){
    const clientes = [
        {nome: "João Silva", cpf: "111.222.333-00", endereco: "Rua A, 17 - Bairro: Jardim das Flores"},
        {nome: "Maria Pereira", cpf: "222.333.444-00", endereco: "Rua B, 44 - Bairro: Oliveiras"},
        {nome: "Carlos Alberto", cpf: "444.555.666-00", endereco: "Rua C, 68 - Bairro: Perdizes"},
        {nome: "Rodrigo Marinho", cpf: "666.777.888-00", endereco: "Rua D, 103 - Bairro: Avenida Central"}
    ]
    res.render("clientes", {
        clientes: clientes
    })

})

// ROTA PRODUTOS
app.get("/produtos",function(req,res){
    const produtos = [
        {nome: "Celular Motorola E22", preco: 1200, categoria: "Eletroportáteis"},
        {nome: "Tablet Samsung", preco: 900, categoria: "Eletrônicos"},
        {nome: "Notebook Lenovo", preco: 3200, categoria: "Computadores"},
        {nome: "Fone Bluetooth", preco: 150, categoria: "Periféricos"}
    ]
    res.render("produtos", {
        produtos: produtos
    })

})

// ROTA PEDIDOS
app.get("/pedidos",function(req,res){
    const pedidos = [
        {numero: "983721931", valor: 1200},
        {numero: "983721932", valor: 900},
        {numero: "983721933", valor: 3200},
        {numero: "983721934", valor: 150}
    ]
    res.render("pedidos", {
        pedidos: pedidos
    })

})

// INICIA O SERVIDOR NA PORTA 8080
app.listen(8080,function(erro){
    if(erro) {
        console.log("Ocorreu um erro!")

    }else{
        console.log("Servidor iniciado com sucesso!")
    }
})