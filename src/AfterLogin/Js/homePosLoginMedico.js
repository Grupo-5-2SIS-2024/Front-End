document.addEventListener('DOMContentLoaded', async () => {
    // Função para buscar dados de consultas do backend para o médico específico
    async function buscarConsultas(idMedico) {
        try {
            const response = await fetch(`http://localhost:8080/consultas/medico/${idMedico}`);
            if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar consultas:', error);
            return [];
        }
    }

    // Função para buscar foto do médico do backend
    async function buscarFotoMedico(idMedico) {
        try {
            const response = await fetch(`http://localhost:8080/medico/${idMedico}/foto`);
            if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
            const fotoData = await response.json();
            return fotoData.url; // Supondo que o URL da foto esteja no campo 'url'
        } catch (error) {
            console.error('Erro ao buscar foto do médico:', error);
            return null;
        }
    }

    // Atualizar foto do médico
    async function atualizarFotoMedico(idMedico) {
        const fotoUrl = await buscarFotoMedico(idMedico);
        if (fotoUrl) {
            document.querySelector('.foto-medico').src = fotoUrl;
        }
    }

    // Função para buscar e exibir o nome do médico do sessionStorage
    function atualizarNomeMedico() {
        const nomeMedico = sessionStorage.getItem('nomeMedico'); // Puxa o nome do médico armazenado no sessionStorage
        if (nomeMedico) {
            document.querySelector('.nome-medico').textContent = nomeMedico;
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

    // Inicialização
    const idMedico = sessionStorage.getItem('idMedico'); // Pega o ID do médico armazenado no sessionStorage

    if (idMedico) {
        const consultas = await buscarConsultas(idMedico); // Busca os dados das consultas do backend para o médico específico
        atualizarKPIs(consultas); // Atualiza os KPIs
        atualizarAgenda(consultas); // Preenche a tabela de agenda
        atualizarAnotacoes(consultas); // Preenche a lista de anotações
        atualizarGrafico(consultas); // Atualiza o gráfico de desempenho
        atualizarFotoMedico(idMedico); // Atualiza a foto do médico
        atualizarNomeMedico(); // Atualiza o nome do médico do sessionStorage
    } else {
        console.error('ID do médico não encontrado no sessionStorage.');
    }
});

