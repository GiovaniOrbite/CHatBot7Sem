// para usarmos o arquivo do banco de dados em outros arquivos, devemos exportar o comando para abrir conexão com o banco de dados, que no caso é o "module.exports"

const Database = require('sqlite-async'); // instancia o banco de dados no js

function execute(db){
    // criar as tabelas do banco de dados
    return db.exec(`
        CREATE TABLE IF NOT EXISTS proffys (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT,
            avatar TEXT,
            whatsapp TEXT,
            bio TEXT
        );
            
        CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject INTEGER,
            cost TEXT,
            proffy_id INTEGER
        );
                
        CREATE TABLE IF NOT EXISTS class_schedule (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_id INTEGER,
            weekday INTEGER,
            time_from INTEGER,
            time_to INTEGER
        );
    `) // para executar comandos sql nesse arquivo, basta colocar o comando entre crase ` `
}

module.exports = Database.open(__dirname + '/database.sqlite').then(execute); // abre conexão com o banco de dados na aplicação. Para que não o js não execute outra instrução enquanto está abrindo a conexão com o banco de dados, pode utilizar o método "then()" para executar uma instrução determinanda assim que terminar de abrir a conexão com o banco de dados.

