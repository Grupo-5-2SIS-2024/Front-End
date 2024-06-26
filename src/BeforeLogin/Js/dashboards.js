

async function buscar() {
    console.log("passei por aqui");

    try {
        const resposta = await fetch("http://localhost:8080/consultas/agendamentosProximos");
        if (!resposta.ok) {
            throw new Error(`HTTP error! Status: ${resposta.status}`);
        }
        const respostaDados = await resposta.json();
        console.log(respostaDados);

        const cards = document.getElementById("tableUpcomingAppointments");
        cards.innerHTML = respostaDados.map((item) => {
            return `                     <tr>
                        <th>${item.nomePaciente}</th>
                        <th>${item.dataConsulta}</th>
                        <th>${item.especialidadeMedico}</th>
                    </tr> `;
        }).join('');
    } catch (error) {
        console.error('Failed to fetch:', error);
    }
}

console.log("antes de buscar");
buscar();
console.log("depois de buscar");


// GRAFICO 2

async function buscarRosca() {
    console.log("passei por aqui");

    try {
        const resposta = await fetch("http://localhost:8080/consultas/percentagem-concluidos");
        if (!resposta.ok) {
            throw new Error(`HTTP error! Status: ${resposta.status}`);
        }
        const respostaDados = await resposta.json();
        console.log(respostaDados);

        const data = {
            labels: ['Total', 'Porcentagem de Atendimento Concluidos'],
            datasets: [{
                label: 'Consultas',
                data: [100, respostaDados.percentagemConcluidos],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)'
                ],
                hoverOffset: 4
            }]
        };

        const config = {
            type: 'doughnut',
            data: data,
        };

        const ctx = document.getElementById('GraficoRosca').getContext('2d');
        graficoRosca = new Chart(ctx, config);
    } catch (error) {
        console.error('Failed to fetch:', error);
    }
}

console.log("antes de buscar");
buscarRosca();
console.log("depois de buscar");


// GRAFICO 3
async function buscarBarraY() {
    console.log("passei por aqui");

    try {
        const resposta = await fetch("http://localhost:8080/consultas/altas-ultimos-seis-meses");
        if (!resposta.ok) {
            throw new Error(`HTTP error! Status: ${resposta.status}`);
        }
        const respostaDados = await resposta.json();
        console.log(respostaDados);

        // Extracting the data correctly
        const labels = respostaDados.map(item => `Mês ${item.mes}`);
        const dataValues = respostaDados.map(item => item.total);

        const data = {
            labels: labels,
            datasets: [{
                axis: 'y',
                label: 'Consultas por Mês',
                data: dataValues,
                fill: false,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y',
            }
        };

        const ctx = document.getElementById('GraficoBarraHorizontal').getContext('2d');
        new Chart(ctx, config);
    } catch (error) {
        console.error('Failed to fetch:', error);
    }
}

console.log("antes de buscar");
buscarBarraY();
console.log("depois de buscar");



// GRAFICO 4


async function buscarLinhasFidelizacao() {
    console.log("passei por aqui");

    try {
        const resposta = await fetch("http://localhost:8080/pacientes/conversoes-ultimos-seis-meses");
        if (!resposta.ok) {
            throw new Error(`HTTP error! Status: ${resposta.status}`);
        }
        const respostaDados = await resposta.json();
        console.log(respostaDados);

        // Extracting the data correctly
        const labels = respostaDados.map(item => `Mês ${item.mes}`);
        const dataValues = respostaDados.map(item => item.total);

        const data = {
            labels: labels,
            datasets: [{
                label: 'Conversões por Mês',
                data: dataValues,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };

        const config = {
            type: 'line',
            data: data,
        };

        const ctx = document.getElementById('GraficoLinhaFidelizacao').getContext('2d');
        new Chart(ctx, config);
    } catch (error) {
        console.error('Failed to fetch:', error);
    }
}

console.log("antes de buscar");
buscarLinhasFidelizacao();
console.log("depois de buscar");


// GRAFICO 5 


async function buscarBarra() {
    console.log("passei por aqui");

    try {
        const resposta = await fetch("http://localhost:8080/consultas/horarios-ultimos-seis-meses");
        if (!resposta.ok) {
            throw new Error(`HTTP error! Status: ${resposta.status}`);
        }
        const respostaDados = await resposta.json();
        console.log(respostaDados);

        // Extracting the data correctly
        const labels = respostaDados.map(item => `Mês ${item.mes}`);
        const dataValuesAgendados = respostaDados.map(item => item.agendados);
        const dataValuesDisponiveis = respostaDados.map(item => item.disponiveis);

        const ctx = document.getElementById('GraficoBarraDePe').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Agendados',
                        data: dataValuesAgendados,
                        backgroundColor: 'rgba(0, 204, 0, 0.6)',
                        borderColor: 'rgba(0, 204, 0, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Disponiveis',
                        data: dataValuesDisponiveis,
                        backgroundColor: 'rgba(0, 102, 0, 0.6)',
                        borderColor: 'rgba(0, 102, 0, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (error) {
        console.error('Failed to fetch:', error);
    }
}

console.log("antes de buscar");
buscarBarra();
console.log("depois de buscar");
