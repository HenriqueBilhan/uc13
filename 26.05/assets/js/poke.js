const nomePokemon = document.querySelector(".nome_pokemon");
const numeroPokemon = document.querySelector(".numero_pokemon");
const imagemPokemon = document.querySelector(".imagem_pokemon");
const formulario = document.querySelector(".formulario");
const campoBusca = document.querySelector(".campo_busca");
const botaoAnterior = document.querySelector(".botao_anterior");
const botaoProximo = document.querySelector(".botao_proximo");

let pokemonAtual = 1;

async function buscarPokemon(pokemon) {

    const respostaAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)

    if (respostaAPI.status === 200) {
        const dados = await respostaAPI.json()
        return dados
    }
}

async function exibirPokemon(pokemon) {
    nomePokemon.innerHTML = "Carregando..."
    numeroPokemon.innerHTML = "";

const dados = await buscarPokemon(pokemon);
if (dados) {
    imagemPokemon.style.display = 'block';
    nomePokemon.innerHTML = dados.name;
    numeroPokemon.innerHTML = dados.id;
    imagemPokemon.src = dados.sprites.versions['generation-v']['black-white'].animated.front_default;
    campoBusca.value = '';
    pokemonAtual = dados.id;
} else {
    imagemPokemon.style.display = 'none';
    nomePokemon.innerHTML = "não encontrado."
    numeroPokemon.innerHTML = "";
}

}

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    exibirPokemon(campoBusca.value.toLowerCase());
});
botaoAnterior.addEventListener('click', function () {
    if (pokemonAtual > 1) {
        pokemonAtual -= 1;
        exibirPokemon(pokemonAtual);
    }
});
exibirPokemon(pokemonAtual);