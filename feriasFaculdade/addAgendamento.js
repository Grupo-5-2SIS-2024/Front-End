// Função para formatar data
function formatarData(data) {
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

// Função para determinar o ícone com base no gênero do paciente
function obterIconeGenero(genero) {
    if (genero.toLowerCase() === 'masculino') {
        return '<i class="fas fa-male" style="font-size: 50px; color: #1E90FF;"></i>'; // Azul para homens
    } else if (genero.toLowerCase() === 'feminino') {
        return '<i class="fas fa-female" style="font-size: 50px; color: #E91E63;"></i>'; // Rosa para mulheres
    } else {
        return '<i class="fas fa-user" style="font-size: 50px; color: #9E9E9E;"></i>'; // Ícone genérico para outros casos
    }
}

// Função para buscar dados da API para consultas
async function buscarConsultas() {
    console.log("Buscando consultas...");

    try {
        const resposta = await fetch("http://localhost:8080/consultas");
        if (!resposta.ok) {
            throw new Error(`HTTP error! Status: ${resposta.status}`);
        }
        const consultas = await resposta.json();
        console.log(consultas);

        // Atualiza a listagem de consultas
        const consultasContainer = document.getElementById("consultas-container");
        consultasContainer.innerHTML = consultas.map((consulta) => {
            return `
                <div class="consulta">
                    ${obterIconeGenero(consulta.paciente.genero)}
                    <div class="consulta-info">
                        <h3>${consulta.paciente.nome} ${consulta.paciente.sobrenome}</h3>
                        <p>${formatarData(consulta.datahoraConsulta)}</p>
                        <p>Médico: ${consulta.medico.nome} ${consulta.medico.sobrenome} - ${consulta.especificacaoMedica.area}</p>
                        <p>Status: ${consulta.statusConsulta.nomeStatus}</p>
                    </div>
                </div>
            `;
        }).join('');
        return consultas;
    } catch (error) {
        console.error('Erro ao buscar consultas:', error);
        return []; // Retorna um array vazio em caso de erro
    }
}

// Função para buscar dados da API para pacientes e médicos e popular os selects
async function buscarPacientesEMedicos() {
    console.log("Buscando pacientes e médicos...");

    try {
        const respostaPacientes = await fetch("http://localhost:8080/pacientes");
        if (!respostaPacientes.ok) {
            throw new Error(`HTTP error! Status: ${respostaPacientes.status}`);
        }
        const pacientes = await respostaPacientes.json();
        console.log(pacientes);

        const respostaMedicos = await fetch("http://localhost:8080/medicos");
        if (!respostaMedicos.ok) {
            throw new Error(`HTTP error! Status: ${respostaMedicos.status}`);
        }
        const medicos = await respostaMedicos.json();
        console.log(medicos);

        // Adiciona a opção padrão antes de popular as opções reais
        populateSelect('paciente', [{nome: 'Selecione um Paciente', id: ''}, ...pacientes], 'nome', 'id');
        populateSelect('medico', [{nome: 'Selecione um Médico', id: ''}, ...medicos], 'nome', 'id');
    } catch (error) {
        console.error('Erro ao buscar pacientes e médicos:', error);
    }
}

// Função para popular as opções dos selects
function populateSelect(selectId, options, textKey = 'nome', valueKey = 'id') {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = ''; // Limpar opções existentes
    
    // Verifica se a lista de opções é válida e não está vazia
    if (options.length === 0 || options[0] === 'Sem horários disponíveis') {
        const optionElement = document.createElement('option');
        optionElement.textContent = 'Nenhum horário disponível';
        optionElement.value = ''; // Define o valor como vazio
        selectElement.appendChild(optionElement);
        return;
    }

    options.forEach(option => {
        const optionElement = document.createElement('option');
        
        if (typeof option === 'string') {
            // Caso seja uma string, adiciona diretamente
            optionElement.textContent = option;
            optionElement.value = option;
        } else {
            // Caso contrário, utiliza as chaves fornecidas
            optionElement.textContent = option[textKey];
            optionElement.value = option[valueKey];
        }
        
        selectElement.appendChild(optionElement);
    });
}

// Função para obter horários disponíveis para um dia específico, considerando todos os médicos
async function getAvailableHours(dia) {
    console.log("Obtendo horas disponíveis para o dia:", dia);
    const consultas = await buscarConsultas();

    const allHours = [];
    for (let h = 6; h <= 18; h++) {
        const hourStr = h.toString().padStart(2, '0') + ':00';
        allHours.push(hourStr);
    }

    // Lista de horários reservados por qualquer médico
    const bookedHours = consultas
        .filter(consulta => consulta.datahoraConsulta.startsWith(dia))
        .map(consulta => consulta.datahoraConsulta.split('T')[1].substring(0, 5));

    // Horários disponíveis são aqueles que não estão reservados para todos os médicos
    const availableHours = allHours.filter(hora => {
        // Verifica se pelo menos um médico está livre neste horário
        const isHourFullyBooked = consultas.every(consulta => consulta.datahoraConsulta.endsWith(hora));
        return !isHourFullyBooked;
    });

    console.log("Horas disponíveis:", availableHours);
    return availableHours.length > 0 ? availableHours : ['Sem horários disponíveis'];
}

// Função para atualizar as horas disponíveis após a seleção da data
async function updateAvailableHours() {
    const dia = document.getElementById('dia').value;
    if (dia) {
        const availableHours = await getAvailableHours(dia);
        populateSelect('hora', availableHours, null, null);
    }
}

// Função para popular as opções dos selects de maneira eficiente
function populateSelect(selectId, options, textKey = 'nome', valueKey = 'id') {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = ''; // Limpar opções existentes

    options.forEach(option => {
        const optionElement = document.createElement('option');
        if (typeof option === 'string') {
            optionElement.textContent = option;
            optionElement.value = option;
        } else {
            optionElement.textContent = option[textKey];
            optionElement.value = option[valueKey];
        }
        selectElement.appendChild(optionElement);
    });
}

async function updateAvailableDoctors() {
    const dia = document.getElementById('dia').value;
    const hora = document.getElementById('hora').value;

    if (dia && hora) {
        try {
            const consultas = await buscarConsultas();
            const respostaMedicos = await fetch("http://localhost:8080/medicos");
            const medicos = await respostaMedicos.json();

            // Filtra os médicos que têm consultas no horário selecionado
            const bookedDoctors = consultas
                .filter(consulta => consulta.datahoraConsulta.startsWith(`${dia}T${hora}`))
                .map(consulta => consulta.medico.id);

            // Médicos disponíveis são aqueles que não estão na lista de médicos ocupados
            const availableDoctors = medicos.filter(medico => !bookedDoctors.includes(medico.id));
            
            // Popula o select com os médicos disponíveis
            populateSelect('medico', [{ nome: 'Selecione um Médico', id: '' }, ...availableDoctors], 'nome', 'id');
        } catch (error) {
            console.error('Erro ao atualizar médicos disponíveis:', error);
        }
    }
}

async function updateAvailablePatients() {
    const dia = document.getElementById('dia').value;
    const hora = document.getElementById('hora').value;

    if (dia && hora) {
        try {
            const consultas = await buscarConsultas();
            const respostaPacientes = await fetch("http://localhost:8080/pacientes");
            const pacientes = await respostaPacientes.json();

            // Filtra os pacientes que têm consultas no horário selecionado
            const bookedPatients = consultas
                .filter(consulta => consulta.datahoraConsulta.startsWith(`${dia}T${hora}`))
                .map(consulta => consulta.paciente.id);

            // Pacientes disponíveis são aqueles que não estão na lista de pacientes ocupados
            const availablePatients = pacientes.filter(paciente => !bookedPatients.includes(paciente.id));

            // Popula o select com os pacientes disponíveis
            populateSelect('paciente', [{ nome: 'Selecione um Paciente', id: '' }, ...availablePatients], 'nome', 'id');
        } catch (error) {
            console.error('Erro ao atualizar pacientes disponíveis:', error);
        }
    }
}

async function agendarConsulta() {
    const dia = document.getElementById('dia').value;
    const hora = document.getElementById('hora').value;
    const medicoId = document.getElementById('medico').value;
    const pacienteId = document.getElementById('paciente').value;
    const descricao = document.getElementById('descricao').value || "Sem descrição";

    try {
        const respostaEspec = await fetch("http://localhost:8080/medicos");
        if (!respostaEspec.ok) {
            throw new Error(`HTTP error! Status: ${respostaEspec.status}`);
        }

        const medicos = await respostaEspec.json();
        const medicoSelecionado = medicos.find(medico => medico.id == medicoId);

        if (!medicoSelecionado) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Médico não encontrado.',
            });
            return;
        }

        const especificacaoMedicaId = medicoSelecionado.especificacaoMedica.id;

        const dadosConsulta = {
            datahoraConsulta: `${dia}T${hora}:00`,
            descricao: descricao,
            medico: { id: medicoId },
            especificacaoMedica: { id: especificacaoMedicaId },
            statusConsulta: { id: 1 },
            paciente: { id: pacienteId },
            duracaoConsulta: "01:00:00"
        };

        const respostaCadastro = await fetch("http://localhost:8080/consultas", {
            method: "POST",
            body: JSON.stringify(dadosConsulta),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Accept": "application/json"
            }
        });

        if (respostaCadastro.status == 201 || respostaCadastro.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Consulta agendada com sucesso!',
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                window.location.reload();
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Ocorreu um erro ao cadastrar a consulta.',
            });
        }
    } catch (error) {
        console.error('Erro ao agendar consulta:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Erro ao agendar a consulta.',
        });
    }
}

// Inicialização da página
console.log("Iniciando página de agendamentos...");
buscarPacientesEMedicos();
buscarConsultas();

// Inicialização da página
// Inicialização da página
(async function initialize() {
    console.log("Iniciando página de agendamentos...");
    await buscarPacientesEMedicos();
    await buscarConsultas();

    // Atualiza as consultas a cada 30 segundos
    setInterval(async () => {
        await buscarConsultas(); // Atualiza a listagem de consultas
    }, 30000); // Intervalo de 30000 milissegundos (30 segundos)
})();

// Eventos de mudança nos selects
document.getElementById('dia').addEventListener('change', updateAvailableHours);
document.getElementById('hora').addEventListener('change', () => {
    updateAvailableDoctors();
    updateAvailablePatients();
});
document.getElementById('medico').addEventListener('change', updateAvailablePatients);

document.getElementById('agendar').addEventListener('click', agendarConsulta);
