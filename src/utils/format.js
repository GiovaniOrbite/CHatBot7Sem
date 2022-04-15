// Dados
const subjects = [
    "Artes",
    "Biologia",
    "Ciências",
    "Educação Física",
    "Física",
    "Geografia",
    "História",
    "Matemática",
    "Português",
    "Química"
]

const weekdays = [
    "Domingo",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado"
]


// Funcionalidades

function getSubject(subjectNumber){
    const arrayPosition = +subjectNumber - 1; // esse "+" antes do nome da variável identifica o tipo da variável como numérica
    return subjects[arrayPosition];
}

function convertHoursToMinutes(time) {
    const [hour, minutes] = time.split(":")
    return Number((hour * 60) + minutes) // essa função number funciona como um casting para a operação em q ele está executando entre os parênteses
}

module.exports = {
    subjects,
    weekdays,
    getSubject,
    convertHoursToMinutes
}