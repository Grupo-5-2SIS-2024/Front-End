// Simulando dados de um banco de dados
const horarios = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00"
];

const medicos = [
    "Luciano Rosa",
    "Fernanda Brito",
    "João Almeida",
    "Rafaela Santos",
    "Ana Sanchez",
    "Julio Ferraz"
];

const pacientes = [
    { nome: "Clara Rodrigues", foto: "https://via.placeholder.com/50" },
    { nome: "Rafael Souza", foto: "https://via.placeholder.com/50" },
    { nome: "Pedro Matos", foto: "https://via.placeholder.com/50" },
    { nome: "Pedro pinto", foto: "https://via.placeholder.com/50" },
    { nome: "Pedro barbiellini", foto: "https://via.placeholder.com/50" },
    { nome: "Lucca Fernandes", foto: "https://via.placeholder.com/50" },
    { nome: "Valentina Pinto", foto: "https://via.placeholder.com/50" },
    { nome: "Camila Viana", foto: "https://via.placeholder.com/50" }
];

// Simulando consultas existentes
const consultas = [
    { dia: "2024-10-01", hora: "08:00 - 09:00", medico: "Luciano Rosa", paciente: "Clara Rodrigues" },
    { dia: "2024-10-01", hora: "09:00 - 10:00", medico: "Luciano Rosa", paciente: "Rafael Souza" },
    { dia: "2024-10-01", hora: "10:00 - 11:00", medico: "Fernanda Brito", paciente: "Pedro Matos" },
    { dia: "2024-10-10", hora: "10:00 - 11:00", medico: "Fernanda Brito", paciente: "Pedro pinto" },
    { dia: "2024-10-09", hora: "10:00 - 11:00", medico: "Fernanda Brito", paciente: "Pedro barbiellini" },
    // Adicione mais consultas conforme necessário
];

// Função para popular as opções dos selects
function populateSelect(selectId, options) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = ''; // Limpar opções existentes
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.textContent = option.nome || option;
        optionElement.value = option.nome || option; // Atribuir valor para identificação
        selectElement.appendChild(optionElement);
    });
}

// Função para exibir as consultas existentes
function displayConsultas() {
    const consultasContainer = document.getElementById('consultas-container');
    consultasContainer.innerHTML = ''; // Limpar conteúdo existente

    consultas.forEach(consulta => {
        const pacienteData = pacientes.find(paciente => paciente.nome === consulta.paciente);
        const consultaElement = document.createElement('div');
        consultaElement.className = 'consulta';

        consultaElement.innerHTML = `
            <img src="${pacienteData.foto}" alt="Foto de ${consulta.paciente}">
            <div class="consulta-info">
                <h3>${consulta.paciente}</h3>
                <p>${consulta.hora}</p>
                <p>Médico: ${consulta.medico}</p>
            </div>
        `;

        consultasContainer.appendChild(consultaElement);
    });
}

// Função para obter horas disponíveis para um dia e médico específicos
function getAvailableHours(dia, medico) {
    const bookedHours = consultas
        .filter(consulta => consulta.dia === dia && consulta.medico === medico)
        .map(consulta => consulta.hora);
    return horarios.filter(hora => !bookedHours.includes(hora));
}

// Função para obter médicos disponíveis para um dia e hora específicos
function getAvailableDoctors(dia, hora) {
    const bookedDoctors = consultas
        .filter(consulta => consulta.dia === dia && consulta.hora === hora)
        .map(consulta => consulta.medico);
    return medicos.filter(medico => !bookedDoctors.includes(medico));
}

// Popular os selects com dados
populateSelect('paciente', pacientes);
populateSelect('medico', medicos);

document.getElementById('dia').addEventListener('change', updateAvailableHoursAndDoctors);
document.getElementById('hora').addEventListener('change', updateAvailableDoctors);

function updateAvailableHoursAndDoctors() {
    const dia = document.getElementById('dia').value;
    const medico = document.getElementById('medico').value;
    if (dia) {
        const availableHours = getAvailableHours(dia, medico);
        populateSelect('hora', availableHours);
        updateAvailableDoctors();
    }
}

function updateAvailableDoctors() {
    const dia = document.getElementById('dia').value;
    const hora = document.getElementById('hora').value;
    if (dia && hora) {
        const availableDoctors = getAvailableDoctors(dia, hora);
        populateSelect('medico', availableDoctors);
    }
}

document.getElementById('agendar').addEventListener('click', function() {
    const dia = document.getElementById('dia').value;
    const hora = document.getElementById('hora').value;
    const medico = document.getElementById('medico').value;
    const paciente = document.getElementById('paciente').value;

    if (dia && hora && medico && paciente) {
        alert(`Consulta agendada para o dia ${dia} às ${hora} com o médico ${medico} para o paciente ${paciente}.`);
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});

// Chamar a função para exibir as consultas existentes ao carregar a página
document.addEventListener('DOMContentLoaded', displayConsultas);
