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
    try {
        const resposta = await fetch("http://localhost:8080/pacientes");
        const listaPacientes = await resposta.json();

        const pacientesFiltrados = listaPacientes.filter(paciente => {
            const nomeCompleto = `${paciente.nome} ${paciente.sobrenome}`.toLowerCase();
            const dataNascimento = new Date(paciente.dataNascimento).toISOString().split('T')[0]; // Formato yyyy-mm-dd

            return (
                (nomeCompleto.includes(nomeFiltro) || nomeFiltro === '') &&
                (paciente.email.toLowerCase().includes(emailFiltro) || emailFiltro === '') &&
                (paciente.cpf.includes(cpfFiltro) || cpfFiltro === '') &&
                (paciente.telefone.includes(telefoneFiltro) || telefoneFiltro === '') &&
                (dataNascimento === dataNascimentoFiltro || dataNascimentoFiltro === '')
            );
        });

        const cardsPacientes = document.getElementById("listagem");
        cardsPacientes.innerHTML = pacientesFiltrados.map((paciente) => {
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
                        <button class="delete"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            `;
        }).join('');

        // Adiciona evento de clique para os botões de exclusão
        cardsPacientes.querySelectorAll('.delete').forEach((botao) => {
            botao.addEventListener('click', function () {
                const card = this.closest('.cardPaciente');
                const id = card.dataset.pacienteId;

                if (id) {
                    // Mostra o modal de confirmação
                    Swal.fire({
                        title: 'Tem certeza?',
                        text: "Você não poderá reverter isso!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sim, deletar!',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Se o usuário confirmar, chama a função de deletar
                            deletarPaciente(id);
                        }
                    });
                } else {
                    console.error('ID do paciente não encontrado.');
                }
            });
        });

        // Adiciona evento de clique para os botões de atualização
        cardsPacientes.querySelectorAll('.update').forEach((botao) => {
            botao.addEventListener('click', function () {
                const card = this.closest('.cardPaciente');
                const id = card.dataset.pacienteId;

                if (id) {
                    window.location.href = `atualizarPaciente.html?id=${id}`;
                } else {
                    console.error('ID do paciente não encontrado.');
                }
            });
        });
    } catch (e) {
        console.log(e);
    }
}

buscarPacientes();


async function deletarPaciente(id) {
    try {
        // Tenta deletar o acompanhamento
        try {
            const resposta1 = await fetch(`http://localhost:8080/acompanhamentos/${id}`, {
                method: 'DELETE'
            });
            if (!resposta1.ok && resposta1.status !== 404) {
                throw new Error(`Erro ao deletar acompanhamento: ${resposta1.statusText}`);
            }
        } catch (erro) {
            console.warn('Nenhum acompanhamento para deletar ou erro ao deletar acompanhamento:', erro);
        }

        // Tenta deletar as consultas
        try {
            const resposta2 = await fetch(`http://localhost:8080/consultas/${id}`, {
                method: 'DELETE'
            });
            if (!resposta2.ok && resposta2.status !== 404) {
                throw new Error(`Erro ao deletar consultas: ${resposta2.statusText}`);
            }
        } catch (erro) {
            console.warn('Nenhuma consulta para deletar ou erro ao deletar consultas:', erro);
        }

        // Tenta deletar as notas
        try {
            const resposta3 = await fetch(`http://localhost:8080/notas/${id}`, {
                method: 'DELETE'
            });
            if (!resposta3.ok && resposta3.status !== 404) {
                throw new Error(`Erro ao deletar notas: ${resposta3.statusText}`);
            }
        } catch (erro) {
            console.warn('Nenhuma nota para deletar ou erro ao deletar notas:', erro);
        }

        // Deleta o paciente
        const resposta4 = await fetch(`http://localhost:8080/pacientes/${id}`, {
            method: 'DELETE'
        });
        if (!resposta4.ok) {
            throw new Error(`Erro ao deletar paciente: ${resposta4.statusText}`);
        }

        // Se todas as operações forem bem-sucedidas, exibe a mensagem e recarrega a lista de pacientes
        console.log('Paciente deletado com sucesso.');
        buscarPacientes();
    } catch (erro) {
        console.error('Erro ao deletar paciente:', erro);
    }
}

  async function buscarKPIsPaciente() {
    try {
        // Buscar a porcentagem de pacientes em tratamento ABA
        const respostaPorcentagemABA = await fetch("http://localhost:8080/pacientes/porcentagem-aba");
        const porcentagemABA = await respostaPorcentagemABA.json();

        // Buscar o número total de pacientes ativos
        const respostaPacientesAtivos = await fetch("http://localhost:8080/pacientes/ativos");
        const pacientesAtivos = await respostaPacientesAtivos.json();

        // Buscar o número total de pacientes do último trimestre
        const respostaPacientesUltimoTrimestre = await fetch("http://localhost:8080/pacientes/ultimo-trimestre");
        const pacientesUltimoTrimestre = await respostaPacientesUltimoTrimestre.json();

        // Buscar o número de agendamentos vencidos
        const respostaAgendamentosVencidos = await fetch("http://localhost:8080/pacientes/agendamentos-vencidos");
        const agendamentosVencidos = await respostaAgendamentosVencidos.json();

        // Função para adicionar zero à esquerda se necessário
        const formatarNumero = (numero) => numero.toString().padStart(2, '0');

        // Atualiza os elementos de KPI no HTML, com formatação
        document.querySelector(".cardKpi:nth-child(1) .kpiNumber").textContent = porcentagemABA + '%';
        document.querySelector(".cardKpi:nth-child(2) .kpiNumber").textContent = formatarNumero(pacientesAtivos);
        document.querySelector(".cardKpi:nth-child(3) .kpiNumber").textContent = formatarNumero(pacientesUltimoTrimestre);
        document.querySelector(".cardKpi:nth-child(4) .kpiNumber").textContent = formatarNumero(agendamentosVencidos);

    } catch (error) {
        console.error('Erro ao buscar KPIs:', error);
    }
}

buscarKPIsPaciente();
