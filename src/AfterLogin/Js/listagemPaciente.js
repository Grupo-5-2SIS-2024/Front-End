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

    const filtrosAtivos = {
        nome: nome,
        email: email,
        cpf: cpf,
        telefone: telefone,
        dataNascimento: dataNascimento
    };

    const listaFiltrosAtivos = document.getElementById('listaFiltrosAtivos');
    listaFiltrosAtivos.innerHTML = '';

    // Adiciona cada filtro ativo à lista com um botão "X" para remover
    for (const [key, value] of Object.entries(filtrosAtivos)) {
        if (value) {
            const li = document.createElement('li');
            li.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;

            // Cria o botão "X" para remover o filtro
            const botaoRemover = document.createElement('button');
            botaoRemover.textContent = 'X';
            botaoRemover.classList.add('removerFiltro');
            botaoRemover.addEventListener('click', () => removerFiltroEspecifico(key));

            li.appendChild(botaoRemover);
            listaFiltrosAtivos.appendChild(li);
        }
    }
    buscarPacientes(nome, email, cpf, telefone, dataNascimento);
}

function removerFiltroEspecifico(filtro) {
    document.getElementById(`filtro${filtro.charAt(0).toUpperCase() + filtro.slice(1)}`).value = '';
    aplicarFiltros();
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
    const cardsPacientes = document.getElementById("listagem");
    const permissionamentoMedico = sessionStorage.getItem("PERMISSIONAMENTO_MEDICO");
    cardsPacientes.innerHTML = listaPacientes.map((paciente) => {
        const responsavel = paciente.responsavel ? `${paciente.responsavel.nome} ${paciente.responsavel.sobrenome}` : 'Não informado';
        const dataNascimentoFormatada = new Date(paciente.dataNascimento).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const foto = paciente.foto || "../Assets/perfil.jpeg";
        const formatarCPF = (cpf) => cpf ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '';
        const formatarTelefone = (telefone) => telefone ? telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') : '';
        const acoes = permissionamentoMedico === "Supervisor" ? '' : `
                <div class="actions">
                    <button class="update"><i class="fas fa-pencil-alt"></i></button>
                    <button class="delete"><i class="fas fa-trash-alt"></i></button>
                </div>`;

        return `
            <div onclick="abrirModalPaciente(${paciente.id})" class="cardPaciente" data-paciente-id="${paciente.id}">
            <img src="${foto}" alt="Foto do Paciente">
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
                ${acoes}
            </div>
        `;
    }).join('');

        cardsPacientes.querySelectorAll('.delete').forEach((botao) => {
            botao.addEventListener('click', function () {
                const id = this.closest('.cardPaciente').dataset.pacienteId ;
                if (id) {
                    Swal.fire({
                        title: 'Tem certeza?',
                        text: "Você não poderá reverter isso!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sim, deletar!',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) deletarPaciente(id);
                    });
                }
            });
        });

        cardsPacientes.querySelectorAll('.update').forEach((botao) => {
            botao.addEventListener('click', function () {
                const id = this.closest('.cardPaciente').dataset.pacienteId ;
                if (id) window.location.href = `atualizarPaciente.html?id=${id}`;
            });
        });
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

// Função para abrir o modal com os dados do paciente
function abrirModalPaciente(idPaciente) {
    document.getElementById('modalBackdrop').style.display = 'flex';

    // Chamada ao endpoint para buscar as informações detalhadas do paciente
    fetch(`http://localhost:8080/pacientes/${idPaciente}`)
        .then(response => response.json())
        .then(data => {
            // Exibe o nome e a foto do paciente no modal
            document.getElementById('pacienteNome').textContent = `${data.nome} ${data.sobrenome}`;
            document.getElementById('pacienteFoto').src = data.fotoUrl || '../Assets/perfil.jpeg';
            
            // Preenche as abas com as informações do paciente
            preencherDetalhes(data);
            preencherCalendario(data.id);
            preencherRelatorios(data.id);

            // Define a aba "Detalhes" como a aba ativa
            openTab(null, 'detalhes');
        })
        .catch(error => {
            console.error("Erro ao buscar dados do paciente:", error);
            alert("Não foi possível carregar as informações do paciente.");
        });
}

// Função para fechar o modal do paciente
function fecharModalPaciente() {
    document.getElementById('modalBackdrop').style.display = 'none';
}

// Função para abrir a aba selecionada
function openTab(event, tabId) {
    const tabs = document.querySelectorAll('.content');
    tabs.forEach(tab => tab.classList.remove('show'));

    document.getElementById(tabId).classList.add('show');

    document.querySelectorAll('.tab-btn').forEach(tabBtn => tabBtn.classList.remove('active'));
    if (event) event.currentTarget.classList.add('active');
}

// Função para preencher os detalhes do paciente
function preencherDetalhes(paciente) {
    const detalhesContainer = document.getElementById('detalhes');
    detalhesContainer.innerHTML = `
        <div class="detalhe-item"><strong>CPF:</strong> ${formatarCPF(paciente.cpf)}</div>
        <div class="detalhe-item"><strong>Email:</strong> ${paciente.email}</div>
        <div class="detalhe-item"><strong>Telefone:</strong> ${formatarTelefone(paciente.telefone)}</div>
        <div class="detalhe-item"><strong>Data de Nascimento:</strong> ${new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')}</div>
        <div class="detalhe-item"><strong>Endereço:</strong> ${paciente.endereco || 'Não informado'}</div>
        <div class="detalhe-item"><strong>Informações Adicionais:</strong> ${paciente.outrasInformacoes || 'N/A'}</div>
    `;
}

// Função para preencher o calendário do paciente
function preencherCalendario(pacienteId) {
    buscarConsultasCliente(pacienteId);
}

// Função para preencher os relatórios do paciente
function preencherRelatorios(pacienteId) {
    const relatoriosContainer = document.getElementById('relatorios');
    relatoriosContainer.innerHTML = `
        <div class="relatorio-item">Relatório 1: Detalhes...</div>
        <div class="relatorio-item">Relatório 2: Detalhes...</div>
    `;
}

// Função para formatar CPF
function formatarCPF(cpf) {
    return cpf ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '';
}

// Função para formatar telefone
function formatarTelefone(telefone) {
    return telefone ? telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') : '';
}

let dataInicioAtual = obterInicioDaSemana(new Date());
let consultasOriginais = [];
let bancoDeDadosFiltrado = [];

// Função para obter o início da semana a partir de uma data, ajustando para segunda-feira
function obterInicioDaSemana(date) {
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // Ajuste para segunda-feira como o primeiro dia da semana
    const startDate = new Date(date);
    startDate.setDate(date.getDate() + diff);
    return startDate;
}

// Função para buscar consultas de um paciente específico
async function buscarConsultasCliente(pacienteId) {
    try {
        const resposta = await fetch("http://localhost:8080/consultas");
        if (!resposta.ok) {
            throw new Error(`HTTP error! Status: ${resposta.status}`);
        }
        const todasConsultas = await resposta.json();

        // Filtra as consultas apenas do paciente atual
        consultasOriginais = todasConsultas.filter(consulta => consulta.paciente.id === pacienteId);
        bancoDeDadosFiltrado = filtrarConsultasPorPermissao();
        atualizarDisplayCalendario(bancoDeDadosFiltrado);
    } catch (error) {
        console.error('Erro ao buscar consultas do paciente:', error);
    }
}

// Função para filtrar as consultas com base no tipo de usuário
function filtrarConsultasPorPermissao() {
    const permissao = sessionStorage.getItem('PERMISSIONAMENTO_MEDICO');
    const idMedico = parseInt(sessionStorage.getItem('ID_MEDICO'));
    const especificacaoMedica = sessionStorage.getItem('ESPECIFICACAO_MEDICA');

    if (permissao === 'Médico' && idMedico) {
        return consultasOriginais.filter(consulta => consulta.medico.id === idMedico);
    } else if (permissao === 'Supervisor') {
        return consultasOriginais.filter(consulta => consulta.especificacaoMedica.area === especificacaoMedica);
    } else if (permissao === 'Admin') {
        return consultasOriginais;
    }
    return [];
}

// Função para atualizar o display de dados no calendário do paciente
function atualizarDisplayCalendario(consultasCliente) {
    const diasSemanaElement = document.getElementById('diasSemana');
    diasSemanaElement.innerHTML = '';

    consultasCliente.forEach(consulta => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.innerText = consulta.descricao;
        diasSemanaElement.appendChild(taskElement);
    });
}

// Função para atualizar os detalhes da data no calendário
function atualizarDisplayData(startDate) {
    dataInicioAtual = obterInicioDaSemana(startDate);
    const endDate = new Date(dataInicioAtual);
    endDate.setDate(dataInicioAtual.getDate() + 6);

    const options = { day: '2-digit', month: 'long' };
    const startStr = `${dataInicioAtual.toLocaleDateString('pt-BR', options)} ${dataInicioAtual.getFullYear()}`;
    const endStr = `${endDate.toLocaleDateString('pt-BR', options)} ${endDate.getFullYear()}`;

    document.getElementById('dias').innerText = `${startStr} - ${endStr}`;
    atualizarDiasDaSemana(dataInicioAtual);
}

// Função para atualizar os dias da semana
function atualizarDiasDaSemana(startDate) {
    const diasSemanaElement = document.getElementById('diasSemana');
    diasSemanaElement.innerHTML = '';

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        const options = { weekday: 'short', day: '2-digit' };
        const dayStr = currentDate.toLocaleDateString('pt-BR', options);

        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.innerText = dayStr;

        diasSemanaElement.appendChild(dayElement);
    }

    atualizarColunasDeTarefas(startDate);
}

// Função para atualizar as colunas de tarefas do calendário
function atualizarColunasDeTarefas(startDate) {
    const colunasTarefasElement = document.getElementById('colunasTarefas');
    colunasTarefasElement.innerHTML = '';

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);

        const tasks = bancoDeDadosFiltrado.filter(entry => entry.datahoraConsulta.startsWith(formatarData(currentDate)));

        const columnElement = document.createElement('div');
        columnElement.className = 'column';

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.innerText = task.descricao;
            columnElement.appendChild(taskElement);
        });

        if (tasks.length === 0) {
            const noTaskElement = document.createElement('div');
            noTaskElement.className = 'task inactive';
            noTaskElement.innerText = 'Sem tarefas';
            columnElement.appendChild(noTaskElement);
        }

        colunasTarefasElement.appendChild(columnElement);
    }
}

// Função para formatar a data
function formatarData(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Funções de navegação para semana anterior e próxima
function semanaPassada() {
    dataInicioAtual.setDate(dataInicioAtual.getDate() - 7);
    atualizarDisplayData(dataInicioAtual);
}

function proximaSemana() {
    dataInicioAtual.setDate(dataInicioAtual.getDate() + 7);
    atualizarDisplayData(dataInicioAtual);
}

// Função para inicializar a página e buscar as consultas do paciente específico
async function inicializarPagina(idPaciente) {
    await buscarConsultasCliente(idPaciente);
    atualizarDisplayData(dataInicioAtual);
}

// Evento para fechar o modal ao clicar fora do conteúdo
document.getElementById('modalBackdrop').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalBackdrop')) {
        fecharModalPaciente();
    }
});

