module.exports = async function(db, {proffyValue, classValue, classScheduleValues}){
    // para usar o comando await, é necessário usar o comando async na função que está executando o método com o comando await
    // inserir dados na tabela de teachers
    const insertedProffy = await db.run(`
        INSERT INTO proffys (
            name,
            avatar,
            whatsapp,
            bio
        ) VALUES (
            "${proffyValue.name}",
            "${proffyValue.avatar}",
            "${proffyValue.whatsapp}",
            "${proffyValue.bio}" 
        );
    `) // utiliza-se o await para fazer com que o js espere terminar de executar uma instrução para ai sim executar a instrução seguinte. Essa crase é chamada de template literals e é usada no js para indentar os comandos sql no código   
        
    const proffy_id = insertedProffy.lastID

    // inserir dados na tabela classes

    const insertedClass = await db.run(`
        INSERT INTO classes (
            subject,
            cost,
            proffy_id
        ) values (
            "${classValue.subject}",
            "${classValue.cost}",
            "${proffy_id}"
        );
    `)

    const class_id = insertedClass.lastID;

    // inserir dados na tabela schedule
        const insertedAllClassScheduleValues = classScheduleValues.map((classScheduleValue) => {
            return db.run(`
                INSERT INTO class_schedule (
                    class_id,
                    weekday,
                    time_from,
                    time_to
                ) VALUES (
                    "${class_id}",
                    "${classScheduleValue.weekday}",
                    "${classScheduleValue.time_from}",
                    "${classScheduleValue.time_to}"
                );
            `) // o map agrupa em um array os valores do value da arrow function que são retornados 
        }) // a diferença entre o map e o foreach é q o foreach não precisa retornar nada e o map precisa retornar alguma coisa

    
    // aqui vai executar todos os db.runs() das class_schedules
    await Promise.all(insertedAllClassScheduleValues) // essa função serve para fazer uma promessa que irá tentar executar uma determinada função, caso consiga, maravilha, caso não, paciência
}


