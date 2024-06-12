// inputs especiais

const inputIcon = document.querySelector(".input__icon");
const inputIcon2 = document.querySelector(".input__icon2");
const inputPassword = document.getElementById("password");
const inputConfirmedPassword = document.getElementById("confirmedPassword");

const inputFile = document.querySelector("#picture__input");
const pictureImage = document.querySelector(".picture__image");
const pictureImageTxt = "Choose an image";
pictureImage.innerHTML = pictureImageTxt;

inputIcon.addEventListener("click", () => {
    inputIcon.classList.toggle("ri-eye-off-line");
    inputIcon.classList.toggle("ri-eye-line");
    inputPassword.type = inputPassword.type === "password" ? "text" : "password";
});

inputIcon2.addEventListener("click", () => {
    inputIcon2.classList.toggle("ri-eye-off-line");
    inputIcon2.classList.toggle("ri-eye-line");
    inputConfirmedPassword.type = inputConfirmedPassword.type === "password" ? "text" : "password";
});

inputFile.addEventListener("change", function (e) {
    const inputTarget = e.target;
    const file = inputTarget.files[0];

    if (file) {
        const reader = new FileReader();

        reader.addEventListener("load", function (e) {
            const readerTarget = e.target;

            const img = document.createElement("img");
            img.src = readerTarget.result;
            img.classList.add("picture__img");

            pictureImage.innerHTML = "";
            pictureImage.appendChild(img);
        });

        reader.readAsDataURL(file);
    } else {
        pictureImage.innerHTML = pictureImageTxt;
    }
});

// Função para validar o cadastro do colaborador

function validarCadastro() {
    var nome = document.getElementById('nome').value;
    var sobrenome = document.getElementById('sobrenome').value;
    var email = document.getElementById('email').value;
    var telefone = document.getElementById('telefone').value;
    var cpf = document.getElementById('cpf').value;
    var especialidade = document.getElementById('especialidade').value;
    var dataNascimento = document.getElementById('dataNascimento').value;
    var carteirinha = document.getElementById('carteirinha').value;
    var password = document.getElementById('password').value;
    var confirmedPassword = document.getElementById('confirmedPassword').value;
    var nivelAcesso = document.getElementById('nivelAcesso').value;

    // Expressões regulares para validações
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var telefoneRegex = /^\d{10,}$/; // Mínimo de 10 dígitos
    var cpfRegex = /^\d{11}$/; // CPF tem 11 dígitos
    var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/; // Senha: mínimo 8 caracteres, pelo menos uma letra maiúscula, uma letra minúscula e um número

    // Validar cada campo
    var errors = [];

    if (!nome.trim()) {
        document.getElementById('nome').classList.add('error');
        document.getElementById('error-nome').textContent = "Nome é obrigatório.";
        errors.push("Nome é obrigatório.");
    } else {
        document.getElementById('nome').classList.remove('error');
        document.getElementById('error-nome').textContent = "";
    }

    if (!sobrenome.trim()) {
        document.getElementById('sobrenome').classList.add('error');
        document.getElementById('error-sobrenome').textContent = "Sobrenome é obrigatório.";
        errors.push("Sobrenome é obrigatório.");
    } else {
        document.getElementById('sobrenome').classList.remove('error');
        document.getElementById('error-sobrenome').textContent = "";
    }

    if (!emailRegex.test(email)) {
        document.getElementById('email').classList.add('error');
        document.getElementById('error-email').textContent = "E-mail inválido.";
        errors.push("E-mail inválido.");
    } else {
        document.getElementById('email').classList.remove('error');
        document.getElementById('error-email').textContent = "";
    }

    if (!telefoneRegex.test(telefone)) {
        document.getElementById('telefone').classList.add('error');
        document.getElementById('error-telefone').textContent = "Telefone inválido.";
        errors.push("Telefone inválido.");
    } else {
        document.getElementById('telefone').classList.remove('error');
        document.getElementById('error-telefone').textContent = "";
    }

    if (!cpfRegex.test(cpf)) {
        document.getElementById('cpf').classList.add('error');
        document.getElementById('error-cpf').textContent = "CPF inválido.";
        errors.push("CPF inválido.");
    } else {
        document.getElementById('cpf').classList.remove('error');
        document.getElementById('error-cpf').textContent = "";
    }

    if (!especialidade.trim()) {
        document.getElementById('especialidade').classList.add('error');
        document.getElementById('error-especialidade').textContent = "Especialidade é obrigatória.";
        errors.push("Especialidade é obrigatória.");
    } else {
        document.getElementById('especialidade').classList.remove('error');
        document.getElementById('error-especialidade').textContent = "";
    }

    if (!dataNascimento) {
        document.getElementById('dataNascimento').classList.add('error');
        document.getElementById('error-dataNascimento').textContent = "Data de nascimento é obrigatória.";
        errors.push("Data de nascimento é obrigatória.");
    } else {
        document.getElementById('dataNascimento').classList.remove('error');
        document.getElementById('error-dataNascimento').textContent = "";
    }

    if (!carteirinha.trim()) {
        document.getElementById('carteirinha').classList.add('error');
        document.getElementById('error-carteirinha').textContent = "Carteirinha é obrigatória.";
        errors.push("Carteirinha é obrigatória.");
    } else {
        document.getElementById('carteirinha').classList.remove('error');
        document.getElementById('error-carteirinha').textContent = "";
    }

    if (!passwordRegex.test(password)) {
        document.getElementById('password').classList.add('error');
        document.getElementById('error-password').textContent = "Senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula e um número.";
        errors.push("Senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula e um número.");
    } else {
        document.getElementById('password').classList.remove('error');
        document.getElementById('error-password').textContent = "";
    }

    if (password !== confirmedPassword) {
        document.getElementById('confirmedPassword').classList.add('error');
        document.getElementById('error-confirmedPassword').textContent = "As senhas não coincidem.";
        errors.push("As senhas não coincidem.");
    } else {
        document.getElementById('confirmedPassword').classList.remove('error');
        document.getElementById('error-confirmedPassword').textContent = "";
    }

    if (!nivelAcesso.trim()) {
        document.getElementById('nivelAcesso').classList.add('error');
        document.getElementById('error-nivelAcesso').textContent = "Nível de acesso é obrigatório.";
        errors.push("Nível de acesso é obrigatório.");
    } else {
        document.getElementById('nivelAcesso').classList.remove('error');
        document.getElementById('error-nivelAcesso').textContent = "";
    }

    // Exibir os erros se houverem
    if (errors.length > 0) {
        const errorMessage = errors.join("<br>");
        document.querySelector('.error-message').innerHTML = errorMessage;
        return false;
    } else {
        return true;
    }
}

// Função para buscar os valores do colaborador

window.onload = function () {
    const id = getIdFromURL();
    if (id) {
        buscarValores(id);
    } else {
        console.error('ID do médico não encontrado na URL.');
    }
};

function getIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function buscarValores(id) {
    const nomeInput = document.getElementById("nome");
    const sobrenomeInput = document.getElementById("sobrenome");
    const emailInput = document.getElementById("email");
    const telefoneInput = document.getElementById("telefone");
    const cpfInput = document.getElementById("cpf");
    const dataNascimentoInput = document.getElementById("dataNascimento");
    const especialidadeInput = document.getElementById("especialidade");
    const carteirinhaInput = document.getElementById("carteirinha");
    const senhaInput = document.getElementById("password");
    const nivelAcessoInput = document.getElementById("nivelAcesso");

    fetch(`http://localhost:8080/medicos/${id}`).then(res => {
        res.json().then(json => {
            if (json) {
                // Atribui valores nas inputs
                nomeInput.value = json.nome || '';
                sobrenomeInput.value = json.sobrenome || '';
                emailInput.value = json.email || '';
                telefoneInput.value = json.telefone || '';
                cpfInput.value = json.cpf || '';
                dataNascimentoInput.value = json.dataNascimento || '';
                especialidadeInput.value = json.permissao.area || ''; //deixar ao contrário
                carteirinhaInput.value = json.carterinha || '';
                senhaInput.value = json.senha || '';
                nivelAcessoInput.value = json.permissao.nome || ''; //deixar ao contrário
            }
        }).catch(err => console.error("Erro ao processar JSON", err));
    }).catch(err => console.error("Erro ao buscar dados", err));
}

// Função assíncrona para cadastrar o colaborador

async function atualizarColaborador() {
    const id = getIdFromURL();

    if (!id) {
        alert("ID do colaborador não encontrado.");
        return;
    }

    if (validarCadastro()) {
        const nomeDigitado = document.getElementById("nome").value;
        const sobrenomeDigitado = document.getElementById("sobrenome").value;
        const emailDigitado = document.getElementById("email").value;
        const telefoneDigitado = document.getElementById("telefone").value;
        const cpfDigitado = document.getElementById("cpf").value;
        const dataNascimentoDigitada = document.getElementById("dataNascimento").value;
        const especialidadeDigitada = document.getElementById("especialidade").value;
        const carteirinhaDigitada = document.getElementById("carteirinha").value;
        const senhaDigitada = document.getElementById("password").value;
        const nivelAcessoEscolhido = document.getElementById("nivelAcesso").value;
        const fotoEscolhida = document.getElementById("picture__input").files[0];

        const especialidadeMap = {
            "cardiologia": 1,
            "dermatologia": 2,
            "fonodiologia": 3
        };

        const nivelAcessoMap = {
            "Admin": 1,
            "Médico": 2,
            "Recepcionista": 3
        };

        const especialidadeId = especialidadeMap[especialidadeDigitada.toLowerCase()];
        const nivelAcessoId = nivelAcessoMap[nivelAcessoEscolhido];

        if (!especialidadeId || !nivelAcessoId) {
            alert("Opções inválidas selecionadas.");
            return;
        }

        const dadosColaborador = {
            "nome": nomeDigitado,
            "sobrenome": sobrenomeDigitado,
            "email": emailDigitado,
            "telefone": telefoneDigitado,
            "senha": senhaDigitada,
            "carterinha": carteirinhaDigitada,
            "dataNascimento": dataNascimentoDigitada,
            "cpf": cpfDigitado,
        };

        try {
            const respostaCadastro = await fetch(`http://localhost:8080/medicos/${id}`, {
                method: "PUT",
                body: JSON.stringify(dadosColaborador),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });

            if (respostaCadastro.status == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Atualização realizada com sucesso!',
                    text: 'Redirecionando para a área do colaborador...',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = "listagemColaborador.html";
                });
            } else {
                alert("Ocorreu um erro ao atualizar o cadastro");
            }
        } catch (error) {
            alert("Ocorreu um erro ao tentar atualizar: " + error.message);
        }
    }
}
