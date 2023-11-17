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
import UserService from './services/UserService.js'
//importanto bcrypt (hash senha)
import bcrypt from "bcrypt"
//importando express-session
import session from 'express-session'
import Auth from './middleware/Auth.js'


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

//Indicando o express-session para gerador de sessões
app.use(session({
    secret:"lojasecret",
    cookie:{maxAge: 30000}, // sessão expira em 30 seg
    saveUninitialized:false,
    resave:false
}))

// ROTA PRINCIPAL
app.get("/",function(req,res){
    res.render("index")
})
//Rota de Login
app.get("/login", (req, res)=>{
    res.render("login")
  })
  
  app.get("/cadastro", (req, res)=>{
    res.render("cadastro")
  })
//rota de criação de usuario no banco

app.post("/createUser", (req,res)=>{
    const email = req.body.email
    const password = req.body.password

    UserService.GetOne(email).then(user =>{
        if (user ==undefined){
            const salt= bcrypt.genSaltSync(10)
            const hash= bcrypt.hashSync(password, salt)

            UserService.Create(email, hash)
            res.redirect("/login")
        }else{
            res.send(`Usuário já cadastrado`)
        }

    })
})

//rota de autenticação

app.post("/authenticate", (req,res)=>{
    const email = req.body.email
    const password = req.body.password

    UserService.GetOne(email).then(user=>{

        if (user != undefined){ //seusuario existe
            //validar senha
            const correct = bcrypt.compareSync(password,user.password)
            if (correct){
                //Autorizar o login 
            req.session.user = {
                id: user._id,
                email: user.email
            }
            res.redirect("/")
            }else{
                //informar senha incorreta
                req.send(`Senha inválida, você tem mais `)
            }
        }else{
            //informa usuario incorreto
            res.send("Usuário Inexistente")
        }
    })
})

//rota para clientes

app.get("/clientes",Auth,(req,res)=> {
    ClientService.GetAll().then(clients => {
        res.render("clientes", {
            clients : clients
        })
        
    })
})

//Criando Rota do tipo POST
app.post("/createClient",Auth,(req, res) => {
    ClientService.Create(
        req.body.name,
        req.body.cpf,
        req.body.address
    )
    res.redirect("/clientes")
})

//Criando Rota do tipo Find Client
app.get("/findClient/:id", Auth,(req, res) => {
    const id = req.params.id
    ClientService.GetOne(id).then(Client => {
        res.render("dadoscliente", {
            Client : Client
        })
    })
})

//Criando Rota do tipo Update Client
app.post("/updateClient/:id", Auth,(req, res) => {
    ClientService.Update(
        req.body.id,
        req.body.name,
        req.body.cpf,
        req.body.address
    )
    res.redirect("/clientes")
})

//Criando Rota do Tipo Delete Client
app.get("/deleteClient/:id",Auth, (req, res) => {
    const id = req.params.id
    ClientService.Delete(id)
    res.redirect("/clientes")  
})

//Rotas para produtos
app.get("/produtos",Auth,(req,res)=>{
    ProductService.GetAll().then(products=>{
        res.render("produtos",{
            products:products
        })
    } )
})

app.post("/createProduct",Auth, (req,res) =>{
    ProductService.Create(
        req.body.name,
        req.body.price,
        req.body.category
    )
    res.redirect("/produtos")
})

//rota do tipo excluir produto
app.get("/deleteProduct/:id", Auth,(req, res) => {
    const id = req.params.id
    ProductService.Delete(id)
    res.redirect("/produtos")  
})

// Rota do tipo buscar produto
app.get("/findProduct/:id",Auth, (req, res) => {
    const id = req.params.id
    ProductService.GetOne(id).then(Product => {
        res.render("dadosproduto", {
            Product : Product
        })
    })
})
// Rota do tipo alterar produto
app.post("/updateProduct/:id", Auth,(req, res) => {
    ProductService.Update(
        req.body.id,
        req.body.name,
        req.body.price,
        req.body.category
    )
    res.redirect("/produtos")
})


//Rotas para Pedidos

app.get("/pedidos",Auth,(req,res)=> {
    OrderService.GetAll().then(orders =>{
        res.render("pedidos",{
            orders:orders
        })
    })
})

app.post("/createOrder",Auth, (req,res)=>{
    OrderService.Create(
        req.body.code,
        req.body.total
    )
    res.redirect("/pedidos")
})

//Rota para buscar Pedido
app.get("/findOrder/:id", Auth,(req, res) => {
    const id = req.params.id
    OrderService.GetOne(id).then(Order => {
        res.render("dadospedido", {
            Order : Order
        })
    })
})

//Rota para Excluir Pedido
app.get("/deleteOrder/:id", Auth,(req, res) => {
    const id = req.params.id
    OrderService.Delete(id)
    res.redirect("/pedidos")  
})

//Rota para alterar pedido
app.post("/updateOrder/:id",Auth, (req, res) => {
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