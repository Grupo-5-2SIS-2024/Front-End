const ctx = document.getElementById('graficoGeral').getContext('2d');

const graficoGeral = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Fono', 'Psicólogo', 'Neuro', 'Psicopedagogo', 'Terapeuta', 'Nutri', 'Analista'],
        datasets: [
            {
                label: 'Pacientes',
                data: [], // Dados virão do MySQL
                backgroundColor: '#ffcc00'
            },
            {
                label: 'Médicos',
                data: [], // Dados virão do MySQL
                backgroundColor: '#006400'
            },
            {
                label: 'Agendamento',
                data: [], // Dados virão do MySQL
                backgroundColor: '#00cc66'
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const calendarDays = document.getElementById('calendarDays');
const monthYear = document.getElementById('monthYear');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');

let date = new Date();

function renderCalendar() {
    calendarDays.innerHTML = '';
    monthYear.innerText = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendarDays.innerHTML += '<div></div>';
    }

    for (let i = 1; i <= lastDate; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.innerText = i;
        dayDiv.addEventListener('click', () => selectDay(dayDiv));
        calendarDays.appendChild(dayDiv);
    }
}

function selectDay(element) {
    const selected = document.querySelector('.calendar-days .selected');
    if (selected) {
        selected.classList.remove('selected');
    }
    element.classList.add('selected');
}

prevMonth.addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

nextMonth.addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

renderCalendar();