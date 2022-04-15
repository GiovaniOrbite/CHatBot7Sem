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

module.exports = {
    pageLanding,
    pageStudy,
    pageGiveClasses,
    saveClasses
}