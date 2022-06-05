// OBS: no arquivo package.json, para rodar o nodemon é necessário colocar no campo "scripts", a chave "dev" e o valor dessa chave vai ser o comando pra rodar o nodemon ("nodemon src/server.js"). No terminal, para executar esse comando do nodemon, basta colocar assim: "npm run dev"

// o nunjucks funciona como um template engine, ele renderiza uma nova página no front-end a partir das informações atualizadas no back-end

const { pageLanding, pageStudy, pageGiveClasses, saveClasses } = require('./pages');

// Configuração do servidor
const express = require('express')
const nunjucks = require('nunjucks')
const server = express()

// configurando o nunjucks (template engine)
nunjucks.configure('src/views', {
    express: server,
    noCache: true
})

// Inicio e configuração do servidor
server 

// receber os dados do req.body
.use(express.urlencoded({ extended: true })) // comando usado para habilitar o recebimento de dados da pag html através do body da requisição post

server.use(express.static("public")) //comando usado para fazer alguma configuração no servidor e a propriedade express.static vai pegar os arquivos de imagem e formatação de pág conforme o caminho para esses arquivos esteja informado

// rotas da aplicação
.get("/", pageLanding)
.get("/home", pageLanding)
.get("/study", pageStudy)
.get("/give-classes", pageGiveClasses)
.post("/save-classes", saveClasses)

// Start do servidor
.listen(5500) //comando usado para chamar o servidor e criar uma dependência nele. A função "listen" define a porta na qual o servidor será usado

