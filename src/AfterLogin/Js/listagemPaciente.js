// Funções para abrir e fechar o modal de filtros
function abrirModalFiltro() {
    document.getElementById("modalFiltro").style.display = "block";
}
function fecharModalFiltro() {
    document.getElementById("modalFiltro").style.display = "none";
}

// Funções para limpar e aplicar filtros
function limparFiltros() {
    document.getElementById('filtroNome').value = '';
    document.getElementById('filtroEmail').value = '';
    document.getElementById('filtroCPF').value = '';
    document.getElementById('filtroTelefone').value = '';
    document.getElementById('filtroDataNascimento').value = '';
    document.getElementById('listaFiltrosAtivos').innerHTML = ''; // Limpa a lista de filtros ativos
    buscarPacientes(); // Busca os pacientes sem filtros
}

function aplicarFiltros() {
    const nome = document.getElementById('filtroNome').value.toLowerCase();
    const email = document.getElementById('filtroEmail').value.toLowerCase();
    const cpf = document.getElementById('filtroCPF').value;
    const telefone = document.getElementById('filtroTelefone').value;
    const dataNascimento = document.getElementById('filtroDataNascimento').value;
    const filtrosAtivos = [];

    if (nome) filtrosAtivos.push(`Nome: ${nome}`);
    if (email) filtrosAtivos.push(`Email: ${email}`);
    if (cpf) filtrosAtivos.push(`CPF: ${cpf}`);
    if (telefone) filtrosAtivos.push(`Telefone: ${telefone}`);
    if (dataNascimento) filtrosAtivos.push(`Data de Nascimento: ${dataNascimento}`);

    const listaFiltrosAtivos = document.getElementById('listaFiltrosAtivos');
    listaFiltrosAtivos.innerHTML = '';
    filtrosAtivos.forEach(filtro => {
        const li = document.createElement('li');
        li.textContent = filtro;
        listaFiltrosAtivos.appendChild(li);
    });

    buscarPacientes(nome, email, cpf, telefone, dataNascimento);
}

// Função para buscar pacientes com filtros específicos
async function buscarPacientes(nomeFiltro = '', emailFiltro = '', cpfFiltro = '', telefoneFiltro = '', dataNascimentoFiltro = '') {
    const permissionamentoMedico = sessionStorage.getItem("PERMISSIONAMENTO_MEDICO");
    const especificacaoMedicaArea = sessionStorage.getItem("ESPECIFICACAO_MEDICA");

    try {
        let listaPacientes = [];

        if (permissionamentoMedico === "Admin") {
            const resposta = await fetch("http://localhost:8080/pacientes");
            listaPacientes = await resposta.json();
        } else if (permissionamentoMedico === "Supervisor" && especificacaoMedicaArea) {
            const respostaPacientes = await fetch("http://localhost:8080/pacientes");
            const todosPacientes = await respostaPacientes.json();

            const respostaConsultas = await fetch("http://localhost:8080/consultas");
            const todasConsultas = await respostaConsultas.json();

            listaPacientes = todosPacientes.filter(paciente =>
                todasConsultas.some(consulta =>
                    consulta.paciente.id === paciente.id &&
                    consulta.especificacaoMedica.area === especificacaoMedicaArea
                )
            );
        } else {
            console.warn("Permissão ou especificação médica não definida.");
            return;
        }

        const pacientesFiltrados = listaPacientes.filter(paciente => {
            const nomeCompleto = `${paciente.nome} ${paciente.sobrenome}`.toLowerCase();
            const dataNascimento = new Date(paciente.dataNascimento).toISOString().split('T')[0];
            return (
                (nomeCompleto.includes(nomeFiltro) || nomeFiltro === '') &&
                (paciente.email.toLowerCase().includes(emailFiltro) || emailFiltro === '') &&
                (paciente.cpf.includes(cpfFiltro) || cpfFiltro === '') &&
                (paciente.telefone.includes(telefoneFiltro) || telefoneFiltro === '') &&
                (dataNascimento === dataNascimentoFiltro || dataNascimentoFiltro === '')
            );
        });

        atualizarListagemPacientes(pacientesFiltrados);
    } catch (e) {
        console.log(e);
    }
}

function atualizarListagemPacientes(listaPacientes) {
    const cardsMedicos = document.getElementById("listagem");
    cardsMedicos.innerHTML = listaPacientes.map((paciente) => {
        const responsavel = paciente.responsavel ? `${paciente.responsavel.nome} ${paciente.responsavel.sobrenome}` : 'Não informado';
        const dataNascimentoFormatada = new Date(paciente.dataNascimento).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

        const formatarCPF = (cpf) => cpf ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '';
        const formatarTelefone = (telefone) => telefone ? telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') : '';

        return `
            <div class="cardPaciente" data-paciente-id="${paciente.id}">
                <div class="info">
                    <div class="field">
                        <label for="nome">Nome</label>
                        <p id="nome">${paciente.nome} ${paciente.sobrenome}</p>
                    </div>
                    <div class="field">
                        <label for="contato">Contato</label>
                        <p id="contato">${formatarTelefone(paciente.telefone)}</p>
                    </div>
                    <div class="field">
                        <label for="responsavel">Responsável</label>
                        <p id="responsavel">${responsavel}</p>
                    </div>
                    <div class="field">
                        <label for="dataNascimento">Data de Nascimento</label>
                        <p id="dataNascimento">${dataNascimentoFormatada}</p>
                    </div>
                    <div class="field">
                        <label for="cpf">CPF</label>
                        <p id="cpf">${formatarCPF(paciente.cpf)}</p>
                    </div>
                </div>
                <div class="actions">
                    <button class="update"><i class="fas fa-pencil-alt"></i></button>
                    <button class="delete" onclick="deletarPaciente(${paciente.id})"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
    }).join('');

    adicionarEventosBotoes(cardsMedicos);
}

async function deletarPaciente(id) {
    try {
        await Promise.all([
            fetch(`http://localhost:8080/acompanhamentos/${id}`, { method: 'DELETE' }),
            fetch(`http://localhost:8080/consultas/${id}`, { method: 'DELETE' }),
            fetch(`http://localhost:8080/notas/${id}`, { method: 'DELETE' }),
            fetch(`http://localhost:8080/pacientes/${id}`, { method: 'DELETE' })
        ]);
        console.log('Paciente deletado com sucesso.');
        buscarPacientes();
    } catch (erro) {
        console.error('Erro ao deletar paciente:', erro);
    }
}

async function buscarKPIsPaciente() {
    try {
        const [porcentagemABA, pacientesAtivos, pacientesUltimoTrimestre, agendamentosVencidos] = await Promise.all([
            fetch("http://localhost:8080/pacientes/porcentagem-aba").then(r => r.json()),
            fetch("http://localhost:8080/pacientes/ativos").then(r => r.json()),
            fetch("http://localhost:8080/pacientes/ultimo-trimestre").then(r => r.json()),
            fetch("http://localhost:8080/pacientes/agendamentos-vencidos").then(r => r.json())
        ]);

        document.querySelector(".cardKpi:nth-child(1) .kpiNumber").textContent = porcentagemABA + '%';
        document.querySelector(".cardKpi:nth-child(2) .kpiNumber").textContent = pacientesAtivos.toString().padStart(2, '0');
        document.querySelector(".cardKpi:nth-child(3) .kpiNumber").textContent = pacientesUltimoTrimestre.toString().padStart(2, '0');
        document.querySelector(".cardKpi:nth-child(4) .kpiNumber").textContent = agendamentosVencidos.toString().padStart(2, '0');
    } catch (error) {
        console.error('Erro ao buscar KPIs:', error);
    }
}

buscarPacientes();
buscarKPIsPaciente();
