function validarSessao() {
    var idMedico = sessionStorage.getItem("ID_MEDICO");
    var nomeMedico = sessionStorage.getItem("NOME_MEDICO");
    var sobrenomeMedico = sessionStorage.getItem("SOBRENOME_MEDICO");
    var nivelPermissao = sessionStorage.getItem("PERMISSIONAMENTO_MEDICO");

    // Atualizar o nome e a permissão na navbar
    var userNome = document.getElementById("user_nome");
    var userPermissao = document.getElementById("user_permissao");

    if (userNome && userPermissao) {
        userNome.textContent = `${nomeMedico} ${sobrenomeMedico}`;
        userPermissao.textContent = nivelPermissao;
    }

    // Atualizar o link "Home" baseado na permissão
    var homeLink = document.querySelector("#side_items .side-item a");

    if (homeLink) {
        if (nivelPermissao === "Admin" || nivelPermissao === "Supervisor") {
            homeLink.href = "HomeAdm.html"; // Altera o link para a Home de Admin
        } else if (nivelPermissao === "Medico") {
            homeLink.href = "homePosLoginMedico.html"; // Mantém o link para a Home de Médico
        }
    }


    if (nivelPermissao === "Admin") {
        // ADM pode acessar tudo, nenhuma ação necessária
    } else if (nivelPermissao === "Supervisor") {

        // Supervisor: remover funções de adicionar pacientes e cadastrar colaboradores

        const cadastrarPacienteBtn = document.getElementById("addPacienteBtn");
        const adicionarColaboradorBtn = document.getElementById("btnAdicionarColaborador");

        if (cadastrarPacienteBtn) {
            cadastrarPacienteBtn.style.display = "none";
        }
        if (adicionarColaboradorBtn) {
            adicionarColaboradorBtn.style.display = "none";
        }
    } else if (nivelPermissao === "Médico") {

        // Médico: remover botoes de Colaboradores, Pacientes e Dashboards
        
        const Colaboradores = document.getElementById("Colaborador");
        const Pacientes = document.getElementById("Paciente");
        const Dashboards = document.getElementById("Dash");

        if (Colaboradores) {
            Colaboradores.style.display = "none";
        }
        if (Pacientes) {
            Pacientes.style.display = "none"
        }
        if (Dashboards) {
            Dashboards.style.display = "none"
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
