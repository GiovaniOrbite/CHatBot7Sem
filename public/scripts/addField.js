// Procurar o botão
document.querySelector("#add-time")/*função usada para pegar os names do id e class do html e executar alguma ação, mais conhecido como DOM*/
// Quando clicar no botão
.addEventListener("click", cloneField);/*o javascript lida com as interações do usuário na pag criando, deletando e manipulando eventos e essa função adiciona um novo evento ao javascript para lidar com a interação do usuário na pag*/

// Executar uma ação 
function cloneField(){
    console.log("Cheguei aqui");
    // Duplicar os campos
    const newFieldContainer = document.querySelector(".schedule-item").cloneNode(true); /*a propriedade cloneNode pega a estrutura referenciada pelo querySelector e fazer um clone dessa estrutura, mas para isso é necessário passar um boolean para q ele entenda se é para pegar a estrutura (true) ou não (false) (obs: toda funcionalidade do javascript referente ao html será identificada pelo elemento Node)*/
    
    // pegar os campos da estrutura html
    const fields = newFieldContainer.querySelectorAll("input"); /*esse querySelectorAll pega todas as estruturas html identificadas como input*/

    // limpar os campos capturados no html
    fields.forEach(function(field) {
      // pegar o campo para limpar
      field.value = ""  
    })

    // Colocar na página

    document.querySelector("#schedule-items").appendChild(newFieldContainer); /*a propriedade appendChild pega a estrutura que o cloneNode pegou no html e coloca no campo referenciado pelo id no querySelector*/
}
