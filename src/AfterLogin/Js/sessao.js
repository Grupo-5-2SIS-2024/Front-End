function validarSessao() {
    // Acessando as chaves corretas do sessionStorage
    var idMedico = sessionStorage.getItem("ID_MEDICO");
    var nomeMedico = sessionStorage.getItem("NOME_MEDICO");
    var sobrenomeMedico = sessionStorage.getItem("SOBRENOME_MEDICO");
    var nivelPermissao = sessionStorage.getItem("PERMISSIONAMENTO_MEDICO");

    console.log("ID_MEDICO:", idMedico);
    console.log("NOME_MEDICO:", nomeMedico);
    console.log("SOBRENOME_MEDICO:", sobrenomeMedico);
    console.log("PERMISSIONAMENTO_MEDICO:", nivelPermissao);

    // Verificar se o usuário está logado
    if (!idMedico || !nomeMedico) {
        window.location = "../login.html"; // Redireciona se não estiver logado
        return; // Para a execução da função
    }

    // Atualizar informações do usuário na interface
    var b_usuario = document.getElementById("b_usuario");
    var n_usuario = document.getElementById("n_usuario");

    if (b_usuario) b_usuario.innerHTML = idMedico;
    if (n_usuario) n_usuario.innerHTML = nomeMedico;

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
    } else if (nivelPermissao === "Medico") {
        // Médico: remover links de Colaboradores, Pacientes e Dashboards
        const linkColaboradores = document.getElementById("Colaborador");
        const linkPacientes = document.getElementById("Paciente");
        const linkDashboards = document.getElementById("Dash");

        if (linkColaboradores) {
            linkColaboradores.remove(); // Remove o link de colaboradores
        }
        if (linkPacientes) {
            linkPacientes.remove(); // Remove o link de pacientes
        }
        if (linkDashboards) {
            linkDashboards.remove(); // Remove o link de dashboards
        }
    }
}

// Chama a função ao carregar a página
validarSessao();
