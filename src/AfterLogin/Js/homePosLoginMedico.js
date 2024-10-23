    const idMedico = sessionStorage.getItem('ID_MEDICO'); 
    
    // Função para buscar dados de consultas do backend para o médico específico
    async function buscarConsultas(idMedico) {
        try {
            const response = await fetch(`http://localhost:8080/consultas/listarConsultasMedicoID/${idMedico}`);
            if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar consultas:', error);
            return [];
        }
    }

    // Função para buscar e exibir o nome do médico do sessionStorage
    function atualizarNomeEFotoMedico() {
        const nomeMedico = sessionStorage.getItem('NOME_MEDICO'); // Pega o nome do médico
        const fotoMedico = sessionStorage.getItem('FOTO'); // Pega a URL da foto do médico

        if (nomeMedico) {
            document.querySelector('.nome-medico').textContent = nomeMedico; // Atualiza o nome na tela
        }

        if (fotoMedico) {
            document.querySelector('.foto-medico').src = fotoMedico; // Atualiza a foto na tela
        }
    }

    // Atualizar KPIs
    async function atualizarKPIs(consultas) {
        const consultasHoje = consultas.length;
        const consultasMarcadas = consultas.filter(c => c.statusConsulta.nomeStatus === 'Agendada').length;
        const consultasConcluidas = consultas.filter(c => c.statusConsulta.nomeStatus === 'Realizada').length;
        const consultasCanceladas = consultas.filter(c => c.statusConsulta.nomeStatus === 'Cancelada').length;

        document.getElementById('consultasHoje').textContent = consultasHoje;
        document.getElementById('consultasMarcadas').textContent = consultasMarcadas;
        document.getElementById('consultasConcluidas').textContent = consultasConcluidas;
        document.getElementById('consultasCanceladas').textContent = consultasCanceladas;
    }

    // Atualizar tabela de agenda
    async function atualizarAgenda(consultas) {
        const agendaBody = document.getElementById('agenda-body');
        agendaBody.innerHTML = ''; // Limpa a tabela

        consultas.forEach(consulta => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(consulta.datahoraConsulta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>${consulta.paciente.nome} ${consulta.paciente.sobrenome}</td>
                <td>${consulta.statusConsulta.nomeStatus}</td>
            `;
            agendaBody.appendChild(row);
        });
    }

    // Atualizar anotações de consultas concluídas
    async function atualizarAnotacoes(consultas) {
        const concluidasList = document.getElementById('concluidas-list');
        concluidasList.innerHTML = ''; // Limpa a lista

        consultas.filter(c => c.statusConsulta.nomeStatus === 'Realizada').forEach(consulta => {
            const li = document.createElement('li');
            li.innerHTML = `<h3>${consulta.paciente.nome} - ${new Date(consulta.datahoraConsulta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h3>`;
            li.addEventListener('click', () => showModal(consulta.paciente.nome, consulta.descricao || 'Sem anotações.'));
            concluidasList.appendChild(li);
        });
    }

    // Função para exibir modal de anotações
    function showModal(paciente, anotacao) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');

        modalTitle.textContent = `Anotação para ${paciente}`;
        modalMessage.textContent = anotacao;

        modal.style.display = 'block';
    }

    // Fechar o modal
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });

    window.onclick = function (event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Atualizar gráfico de desempenho
    async function atualizarGrafico(consultas) {
        const consultasMarcadas = consultas.filter(c => c.statusConsulta.nomeStatus === 'Agendada').length;
        const consultasConcluidas = consultas.filter(c => c.statusConsulta.nomeStatus === 'Realizada').length;
        const consultasCanceladas = consultas.filter(c => c.statusConsulta.nomeStatus === 'Cancelada').length;

        const ctx = document.getElementById('consultasChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Marcadas', 'Concluídas', 'Canceladas'],
                datasets: [{
                    label: 'Consultas',
                    data: [consultasMarcadas, consultasConcluidas, consultasCanceladas],
                    backgroundColor: ['#388E3C', '#4CAF50', '#D32F2F']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    if (idMedico) {
        const consultas = await buscarConsultas(idMedico); // Busca os dados das consultas do backend para o médico específico
        atualizarNomeEFotoMedico(); // Atualiza o nome do médico
        atualizarKPIs(consultas); // Atualiza os KPIs
        atualizarAgenda(consultas); // Preenche a tabela de agenda
        atualizarAnotacoes(consultas); // Preenche a lista de anotações
        atualizarGrafico(consultas); // Atualiza o gráfico de desempenho
    } else {
        console.error('ID do médico não encontrado no sessionStorage.');
    }
