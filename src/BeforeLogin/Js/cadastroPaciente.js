// Função para validar o cadastro do paciente
function validarCadastro() {
    var nome = document.getElementById('nome').value;
    var sobrenome = document.getElementById('sobrenome').value;
    var email = document.getElementById('email').value;
    var telefone = document.getElementById('telefone').value;
    var cpf = document.getElementById('cpf').value;
    var genero = document.getElementById('genero').value;
    var dataNascimento = document.getElementById('dataNascimento').value;
    var cns = document.getElementById('cns').value;
    var cep = document.getElementById('cep').value;
    var rua = document.getElementById('rua').value;
    var numero = document.getElementById('numero').value;
    var complemento = document.getElementById('complemento').value;
    var bairro = document.getElementById('bairro').value;

    // Expressões regulares para validações
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var telefoneRegex = /^\d{10,}$/; // Mínimo de 10 dígitos
    var cpfRegex = /^\d{11}$/; // CPF tem 11 dígitos

    // Validar cada campo
    var errors = [];

    if (!nome.trim()) {
        document.getElementById('error-nome').textContent = "Nome é obrigatório.";
        errors.push("Nome é obrigatório.");
    } else {
        document.getElementById('error-nome').textContent = "";
    }

    if (!sobrenome.trim()) {
        document.getElementById('error-sobrenome').textContent = "Sobrenome é obrigatório.";
        errors.push("Sobrenome é obrigatório.");
    } else {
        document.getElementById('error-sobrenome').textContent = "";
    }

    if (!emailRegex.test(email)) {
        document.getElementById('error-email').textContent = "E-mail inválido.";
        errors.push("E-mail inválido.");
    } else {
        document.getElementById('error-email').textContent = "";
    }

    if (!telefoneRegex.test(telefone)) {
        document.getElementById('error-telefone').textContent = "Telefone inválido. Deve conter no mínimo 10 dígitos.";
        errors.push("Telefone inválido.");
    } else {
        document.getElementById('error-telefone').textContent = "";
    }

    if (!cpfRegex.test(cpf)) {
        document.getElementById('error-cpf').textContent = "CPF inválido. Deve conter 11 dígitos.";
        errors.push("CPF inválido.");
    } else {
        document.getElementById('error-cpf').textContent = "";
    }

    if (!genero.trim()) {
        document.getElementById('error-especialidade').textContent = "Gênero é obrigatório.";
        errors.push("Gênero é obrigatório.");
    } else {
        document.getElementById('error-especialidade').textContent = "";
    }

    if (!dataNascimento) {
        document.getElementById('error-dataNascimento').textContent = "Data de nascimento é obrigatória.";
        errors.push("Data de nascimento é obrigatória.");
    } else {
        document.getElementById('error-dataNascimento').textContent = "";
    }

    if (!cns.trim()) {
        document.getElementById('error-cns').textContent = "CNS é obrigatório.";
        errors.push("CNS é obrigatório.");
    } else {
        document.getElementById('error-cns').textContent = "";
    }

    if (!cep.trim()) {
        document.getElementById('error-cep').textContent = "CEP é obrigatório.";
        errors.push("CEP é obrigatório.");
    } else {
        document.getElementById('error-cep').textContent = "";
    }

    if (!rua.trim()) {
        document.getElementById('error-rua').textContent = "Rua é obrigatória.";
        errors.push("Rua é obrigatória.");
    } else {
        document.getElementById('error-rua').textContent = "";
    }

    if (!bairro.trim()) {
        document.getElementById('error-bairro').textContent = "Bairro é obrigatório.";
        errors.push("Bairro é obrigatório.");
    } else {
        document.getElementById('error-bairro').textContent = "";
    }

    if (!numero.trim()) {
        document.getElementById('error-numero').textContent = "Número é obrigatório.";
        errors.push("Número é obrigatório.");
    } else {
        document.getElementById('error-numero').textContent = "";
    }

    // Exibir os erros se houverem
    if (errors.length > 0) {
        return false;
    } else {
        return true;
    }
}

// Função para cadastrar paciente com ou sem responsável
async function cadastrarPaciente(tipoCadastro) {
    if (validarCadastro()) {
        const nomeDigitado = document.getElementById("nome").value;
        const sobrenomeDigitado = document.getElementById("sobrenome").value;
        const emailDigitado = document.getElementById("email").value;
        const telefoneDigitado = document.getElementById("telefone").value;
        const cpfDigitado = document.getElementById("cpf").value;
        const generoEscolhido = document.getElementById("genero").value;
        const dataNascimentoDigitada = document.getElementById("dataNascimento").value;
        const cnsDigitado = document.getElementById("cns").value;
        const cepDigitado = document.getElementById("cep").value;
        const ruaDigitada = document.getElementById("rua").value;
        const numeroDigitado = document.getElementById("numero").value;
        const complementoDigitado = document.getElementById("complemento").value;
        const bairroDigitado = document.getElementById("bairro").value;

        const dadosPaciente = {
            nome: nomeDigitado,
            sobrenome: sobrenomeDigitado,
            email: emailDigitado,
            telefone: telefoneDigitado,
            cpf: cpfDigitado,
            genero: generoEscolhido,
            dataNascimento: dataNascimentoDigitada,
            cns: cnsDigitado,
            endereco: {
                cep: cepDigitado,
                rua: ruaDigitada,
                numero: numeroDigitado,
                complemento: complementoDigitado,
                bairro: bairroDigitado
            }
        };

        const endpoint = tipoCadastro === "comResponsavel"
            ? "http://localhost:8080/pacientes/ComResponsavel"
            : "http://localhost:8080/pacientes/SemResponsavel";

        try {
            const respostaCadastro = await fetch(endpoint, {
                method: "POST",
                body: JSON.stringify(dadosPaciente),
                headers: { "Content-Type": "application/json; charset=UTF-8" }
            });

            if (respostaCadastro.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Paciente cadastrado com sucesso!',
                    text: 'Redirecionando para a lista de pacientes...',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = "listagemPaciente.html";
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao cadastrar paciente',
                    text: 'Por favor, tente novamente.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro de comunicação',
                text: 'Ocorreu um erro ao tentar cadastrar: ' + error.message,
            });
        }
    }
}
