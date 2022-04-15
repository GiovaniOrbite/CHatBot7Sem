const database = require('./db.js') // o "./" informa para o js que ele está na pasta raiz do arquivo
const createProffy = require('./createProffy.js')
database.then(async (db) => {
    // inserir dados
        proffyValue = {
            name: 'Erick Batista',
            avatar: 'https://avatars0.githubusercontent.com/u/55163211?s=460&u=7a6a0f31033edd4ac923eb044ff66c374c0c0ae6&v=4',
            whatsapp: '011940028922',
            bio: 'Professor de Física e Matemática',
        }

        classValue = {
            subject: "Física",
            cost: "20",
            // o proffy_id virá pelo banco de dados
        }

        classScheduleValues = [
            // class_id virá pelo banco de dados após cadastrarmos o class
            {
                weekday: 1,
                time_from: 720,
                time_to: 1220
            },
            {
                weekday: 0,
                time_from: 520,
                time_to: 1220
            }
        ]

    // await createProffy(db, {proffyValue, classValue, classScheduleValues})


    // consultar dados inseridos

    // todos os proffys
       const selectedProffys = await db.all("SELECT * FROM proffys");
       //console.log(selectedProffys);

    // consultar as classes de um determinado professor e trazer junto os dados do professor
        const selectClassesAndProffys = await db.all(`
            SELECT classes.*, proffys.*
            FROM proffys
            JOIN classes ON (classes.proffy_id = proffys.id)
            WHERE classes.proffy_id = 1;
        `)
        // console.log(selectClassesAndProffys)

    // o horário que a pessoa trabalha, por exemplo, é das 8h - 18h
    // o horário do time_from (8h) precisa ser menor ou igual ao horário solicitado
    // o time_to precisa ser acima
    const selectClassesSchedules = await db.all(`
        SELECT class_schedule.*
        FROM class_schedule
        WHERE class_schedule.class_id = "1"
        AND class_schedule.weekday = "0"
        AND class_schedule.time_from <= "520"
        AND class_schedule.time_to > "520";
    `)
    console.log(selectClassesSchedules);

}) // esse db está sendo pego do arquivo db.js