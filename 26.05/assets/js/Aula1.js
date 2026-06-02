const btn = document.getElementById("gerar-piada")
const p = document.getElementById("piada")

btn.addEventListener("click", async () => {
    try{
        //TENTE pegar os dados da api
        const response = await fetch("https://api.chucknorris.io/jokes/random")

        const data = await response.json() //Converte a resposta para um objeto JS, assim nosso codigo pode ler ela

        p.textContent = data.value
    } catch (erro){ //se der ruim
        console.log("Deu ruim, porque: " + erro)
    }
})