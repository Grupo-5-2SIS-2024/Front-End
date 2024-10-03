function validarSessao() {
    var idMedico = sessionStorage.getItem("ID_MEDICO");
    var nomeMedico = sessionStorage.getItem("NOME_MEDICO");
    var sobrenomeMedico = sessionStorage.getItem("SOBRENOME_MEDICO");
    var nivelPermissao = sessionStorage.getItem("PERMISSIONAMENTO_MEDICO");

    console.log("ID_MEDICO:", idMedico);
    console.log("NOME_MEDICO:", nomeMedico);
    console.log("SOBRENOME_MEDICO:", sobrenomeMedico);
    console.log("PERMISSIONAMENTO_MEDICO:", nivelPermissao);

    // Atualizar o nome e a permissão na navbar
    var userNome = document.getElementById("user_nome");
    var userPermissao = document.getElementById("user_permissao");

    if (userNome && userPermissao) {
        userNome.textContent = `${nomeMedico} ${sobrenomeMedico}`;
        userPermissao.textContent = nivelPermissao;
    }

    // Controle de visibilidade baseado na permissão
    if (nivelPermissao === "Admin") {
        // ADM pode acessar tudo, nenhuma ação necessária
    } else if (nivelPermissao === "Supervisor") {
        // Supervisor: remover funções de adicionar pacientes e cadastrar colaboradores
        const cadastrarPacienteBtn = document.getElementById("addPacienteBtn");
        const adicionarColaboradorBtn = document.getElementById("btnAdicionarColaborador");

        if (cadastrarPacienteBtn) {
            cadastrarPacienteBtn.style.display = "none"; // Oculta o botão
        }
        if (adicionarColaboradorBtn) {
            adicionarColaboradorBtn.style.display = "none"; // Oculta o botão
        }
    } else if (nivelPermissao === "Médico") {
        // Médico: remover botoes de Colaboradores, Pacientes e Dashboards
        const Colaboradores = document.getElementById("Colaborador");
        const Pacientes = document.getElementById("Paciente");
        const Dashboards = document.getElementById("Dash");

        if (Colaboradores) {
            Colaboradores.style.display = "none"; // Oculta o botão
        }
        if (Pacientes) {
            Pacientes.style.display = "none" // Oculta o botão
        }
        if (Dashboards) {
            Dashboards.style.display = "none" // Oculta o botão
        }
    }
}
validarSessao();

function deslogar() {

    var emailMedico = sessionStorage.getItem("EMAIL_MEDICO");

  
    if (!emailMedico) {
        window.location = "../../Html/index.html";
        return;
    }

    fetch('http://localhost:8080/medicos/logout', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: emailMedico
        })
    })
    .then(response => {
        if (response.ok) {
            sessionStorage.clear();
            window.location = "../../Html/index.html";
        } else {
            console.error('Erro ao deslogar o médico.');
        }
    })
    .catch(error => {
        console.error('Erro na requisição de logout:', error);
    });
}
