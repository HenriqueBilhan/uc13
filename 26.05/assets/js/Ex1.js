const cepInput = document.querySelector('.Cep input');
const ruaInput = document.querySelector('.Rua input');
const bairroInput = document.querySelector('.Bairro input');
const estadoInput = document.querySelectorAll('.Estado input')[0];
const dddInput = document.querySelectorAll('.Estado input')[1];
const cidadeInput = document.querySelector('.input-group input');
const regiaoInput = document.querySelectorAll('.Estado input')[2];

cepInput.addEventListener('blur', async () => {
    let cep = cepInput.value.replace(/\D/g, '');

    if (cep.length !== 8) {
        alert('CEP inválido!');
        return;
    }

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep.value}/json/`);
        const dados = await resposta.json();

        if (dados) {
            alert('CEP não válido');
            return;
        }

        ruaInput.value = dados.logradouro;
        bairroInput.value = dados.bairro;
        estadoInput.value = dados.uf;
        cidadeInput.value = dados.localidade;
        dddInput.value = dados.ddd;
        regiaoInput.value = dados.regiao;

    } catch (erro) {
        alert('Erro ao buscar o CEP!');
        console.log(erro);
    }
});
