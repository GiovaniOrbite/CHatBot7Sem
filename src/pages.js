const Database = require('./database/db')

const { subjects, weekdays, getSubject, convertHoursToMinutes } = require('./utils/format');

function pageLanding(req, res){
    return res.render("index.html") //comando usado para quando for enviar alguma informação para o front, ele vai retornar uma resposta. Para pegar o arquivo .html e enviar pro front, essa variável "__dirname" e o caminho para encontrar o arquivo devem ser usadas. 
}

async function pageStudy(req, res){
    const filters = req.query // comando usado para pegar as informações passadas do front-end para o back-end através da url do front-end (query string)
    
    if(!filters.subject || !filters.weekday || !filters.time){
        return res.render("study.html", {filters, subjects, weekdays})    
    }

    // converter horas em minutos
    const timeToMinutes = convertHoursToMinutes(filters.time);

    const query = `
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE EXISTS(
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
            AND class_schedule.weekday = ${filters.weekday}
            AND class_schedule.time_from <= ${timeToMinutes}
            AND class_schedule.time_to > ${timeToMinutes}
        )
        AND classes.subject = '${filters.subject}';
    `

    // caso haja erro na hora da consulta do banco de dados
    try {
        const db = await Database
        const proffys = await db.all(query)

        proffys.map((proffy) => {
            proffy.subject = getSubject(proffy.subject);
        })

        return res.render('study.html', { proffys, subjects, filters, weekdays });

    } catch (error) {
        console.log(error)
    }

    //return res.render("study.html", {proffys, filters, subjects, weekdays}) // a função "render" faz com q não precise passar o caminho para localizar o arquivo.html, mas a pasta onde esse arquivo está alocado necessita ser informado nas configurações do nunjucks. Com essa função dá pra renderizar os arquivos.html passando os novos valores para o front-end
}

function pageGiveClasses(req, res){
    // se não tiver data, mostrar a pág novamente
    return res.render("give-classes.html", {subjects, weekdays})
}

async function saveClasses(req, res){
    const createProffy = require('./database/createProffy')
    
    const proffyValue = {
        name: req.body.name,
        avatar: req.body.avatar,
        whatsapp: req.body.whatsapp,
        bio: req.body.bio
    } // essa variavel vai receber os dados através do corpo da requisição, que no caso vai ser o "post"

    const classValue = {
        subject: req.body.subject,
        cost: req.body.cost
    }

    const classScheduleValues = req.body.weekday.map((weekday, index) => {
        return {
            weekday,
            time_from: convertHoursToMinutes(req.body.time_from[index]),
            time_to: convertHoursToMinutes(req.body.time_to[index])
        }
    })

    try {

        const db = await Database
        await createProffy(db, { proffyValue, classValue, classScheduleValues })
        
        let queryString = "?subject=" + req.body.subject // let é uma função que pode ser modificada a qualquer momento
        queryString += "&weekday=" + req.body.weekday[0]
        queryString += "&time=" + req.body.time_from[0]

        return res.redirect("/study" + queryString) // essa função faz com q os dados de uma pág seja redirecionada pra outra pág 
    
    } catch (error) {
        console.log(error);
    }
}

function compare(utterancesArray, answersArray, string) {
    let item;
    for (let x = 0; x < utterancesArray.length; x++) {
      for (let y = 0; y < utterancesArray[x].length; y++) {
        if (utterancesArray[x][y] === string) {
          items = answersArray[x];
          item = items[Math.floor(Math.random() * items.length)];
          }
        }
     }
    return item;
}

function output(input) {
    let product;
    let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");
    text = text
      .replace(/ a /g, " ")
      .replace(/whats/g, "what is")
      .replace(/please /g, "")
      .replace(/ please/g, "");
   
    if (compare(utterances, answers, text)) {
      product = compare(utterances, answers, text);
    } 
    else {
      product = alternatives[Math.floor(Math.random() * alternatives.length)];
    }
   
    //update  DOM
    addChatEntry (input, product);
}

function addChatEntry(input, product) {
    const messagesContainer = document.getElementById("messages");
    
    let userDiv = document.createElement("div");
    userDiv.id = "user";
    userDiv.className = "user response";
    userDiv.innerHTML = `${input}`;
    messagesContainer.appendChild(userDiv);
   
    let botDiv = document.createElement("div");
    let botText = document.createElement("span");
    botDiv.id = "bot";
    botDiv.className = "bot response";
    botText.innerText = "Typing...";
    botDiv.appendChild(botText);
    messagesContainer.appendChild(botDiv);
   
    setTimeout(() => {
      botText.innerText = `${product}`;
    }, 2000);
}

const utterances = [ 
    ["how are you", "how is life", "how are things"],        
    ["hi", "hey", "hello", "good morning", "good afternoon"],      
    ["what are you doing", "what is going on", "what is up"],      
    ["how old are you"],					
    ["who are you", "are you human", "are you bot", "are you human or bot"]
];

const answers = [
    [
     "Fine... how are you?",
     "Pretty well, how are you?",
     "Fantastic, how are you?"
   ],                                                                                  	//0
   [
     "Hello!", "Hi!", "Hey!", "Hi there!", "Howdy"
   ],						
   [
     "Nothing much",
     "About to go to sleep",
     "Can you guess?",
     "I don't know actually"
   ],						
   ["I am infinite"],					
   ["I am just a bot", "I am a bot. What are you?"],	
];

const alternatives = [
    "Go on...",
    "Try again",
];

module.exports = {
    pageLanding,
    pageStudy,
    pageGiveClasses,
    saveClasses,
    compare,
    output,
    addChatEntry
}