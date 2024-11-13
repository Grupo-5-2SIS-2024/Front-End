
let bancoDeDadosFiltrado = []; // Declaração global para dados filtrados





async function inicializarGraficos() {
    // Chama cada gráfico com filtros vazios (exibindo todos os dados)
    atualizarGraficoRosca({});
    atualizarGraficoBarraHorizontal({});
    atualizarGraficoBarraDePe({});
    atualizarGraficoLinhaFidelizacao({});
}

async function inicializarPagina() {

    await preencherCamposDeFiltro(); // Preenche os campos de filtro
    inicializarGraficos(); // Exibe gráficos com todos os dados inicialmente
}

inicializarPagina();








function abrirModalFiltro() {
    document.getElementById('modalFiltro').style.display = 'flex';
    preencherCamposDeFiltro()
}

function fecharModalFiltro() {
    document.getElementById('modalFiltro').style.display = 'none';
}



function aplicarFiltros() {
    // Captura os valores dos filtros
    const medicoId = document.getElementById('filtroMedicoS').value;
    const pacienteId = document.getElementById('filtroPaciente').value;
    const statusId = document.getElementById('filtroStatus').value;
    const areaConsultaId = document.getElementById('filtroAreaConsulta').value;
    const idadePaciente = document.getElementById('filtroIdade').value;
    const generoPaciente = document.getElementById('filtroGenero').value;
    const dataInicio = document.getElementById('filtroDataInicio').value;
    const dataFim = document.getElementById('filtroDataFim').value;

    // Repassa os filtros para a atualização dos gráficos
    atualizarGraficoRosca({ medicoId, pacienteId, statusId, areaConsultaId, idadePaciente, generoPaciente, dataInicio, dataFim });
    atualizarGraficoBarraHorizontal({ medicoId, pacienteId, statusId, areaConsultaId, idadePaciente, generoPaciente, dataInicio, dataFim });
    atualizarGraficoBarraDePe({ medicoId, pacienteId, statusId, areaConsultaId, idadePaciente, generoPaciente, dataInicio, dataFim });
    atualizarGraficoLinhaFidelizacao({ medicoId, pacienteId, statusId, areaConsultaId, idadePaciente, generoPaciente, dataInicio, dataFim });
    
    fecharModalFiltro();
}


function atualizarGraficosComDadosFiltrados() {
    atualizarGraficoRosca(bancoDeDadosFiltrado);
    atualizarGraficoBarraHorizontal(bancoDeDadosFiltrado);
    atualizarGraficoBarraDePe(bancoDeDadosFiltrado);
    atualizarGraficoLinhaFidelizacao(bancoDeDadosFiltrado);
}

function limparFiltros() {
    document.getElementById('filtroMedico').value = '';
    document.getElementById('filtroPaciente').value = '';
    document.getElementById('filtroStatus').value = '';
    document.getElementById('filtroAreaConsulta').value = '';
    document.getElementById('filtroIdade').value = '';
    document.getElementById('filtroGenero').value = '';
    document.getElementById('filtroDataInicio').value = '';
    document.getElementById('filtroDataFim').value = '';

    console.log("Filtros limpos");
}



async function preencherCamposDeFiltro() {
    try {
        console.log("Iniciando o preenchimento dos campos de filtro...");

        // Preencher filtro de médicos
        const respostaMedicos = await fetch("http://localhost:8080/medicos");
        if (!respostaMedicos.ok) throw new Error(`Erro ao buscar médicos: ${respostaMedicos.status}`);
        const medicos = await respostaMedicos.json();
        if (medicos.length === 0) console.warn("Nenhum médico encontrado");
        console.log("Dados de médicos:", medicos);
        const filtroMedico = document.getElementById('filtroMedicoS');
        
        medicos.forEach(medico => {
            console.log(medico.id)
            console.log(medico.nome)
            filtroMedico.innerHTML += `<option value="${medico.id}">${medico.nome}</option>`;
        });

        // Preencher filtro de pacientes
        const respostaPacientes = await fetch("http://localhost:8080/pacientes");
        if (!respostaPacientes.ok) throw new Error(`Erro ao buscar pacientes: ${respostaPacientes.status}`);
        const pacientes = await respostaPacientes.json();
        if (pacientes.length === 0) console.warn("Nenhum paciente encontrado");
        console.log("Dados de pacientes:", pacientes);
        const filtroPaciente = document.getElementById('filtroPaciente');
        filtroPaciente.innerHTML = '<option value="">Todos os Pacientes</option>';
        pacientes.forEach(paciente => {
            filtroPaciente.innerHTML += `<option value="${paciente.id}">${paciente.nome}</option>`;
        });

        // Preencher filtro de status de consultas
        const respostaStatus = await fetch("http://localhost:8080/statusConsultas");
        if (!respostaStatus.ok) throw new Error(`Erro ao buscar status de consultas: ${respostaStatus.status}`);
        const status = await respostaStatus.json();
        if (status.length === 0) console.warn("Nenhum status encontrado");
        console.log("Dados de status de consultas:", status);
        const filtroStatus = document.getElementById('filtroStatus');
        filtroStatus.innerHTML = '<option value="">Todos os Status</option>';
        status.forEach(status => {
            filtroStatus.innerHTML += `<option value="${status.id}">${status.nomeStatus}</option>`;
        });

        // Preencher filtro de área de consultas
        const respostaAreas = await fetch("http://localhost:8080/especificacoes");
        if (!respostaAreas.ok) throw new Error(`Erro ao buscar áreas de consulta: ${respostaAreas.status}`);
        const areas = await respostaAreas.json();
        if (areas.length === 0) console.warn("Nenhuma área de consulta encontrada");
        console.log("Dados de áreas de consulta:", areas);
        const filtroAreaConsulta = document.getElementById('filtroAreaConsulta');
        filtroAreaConsulta.innerHTML = '<option value="">Todas as Áreas</option>';
        areas.forEach(area => {
            filtroAreaConsulta.innerHTML += `<option value="${area.id}">${area.area}</option>`;
        });

        console.log("Campos de filtro preenchidos com sucesso.");
    } catch (error) {
        console.error("Erro ao preencher campos de filtro:", error);
    }
}

async function inicializarGraficos() {
    // Chama cada gráfico com filtros vazios (exibindo todos os dados)
    atualizarGraficoRosca({});
    atualizarGraficoBarraHorizontal({});
    atualizarGraficoBarraDePe({});
    atualizarGraficoLinhaFidelizacao({});
}


















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

// async function buscarRosca() {
//     console.log("passei por aqui");

//     try {
//         const resposta = await fetch("http://localhost:8080/consultas/percentagem-concluidos");
//         if (!resposta.ok) {
//             throw new Error(`HTTP error! Status: ${resposta.status}`);
//         }
//         const respostaDados = await resposta.json();
//         console.log(respostaDados);

//         const data = {
//             labels: ['Total', 'Porcentagem de Atendimento Concluidos'],
//             datasets: [{
//                 label: 'Consultas',
//                 data: [100, respostaDados.percentagemConcluidos],
//                 backgroundColor: [
//                     'rgb(255, 99, 132)',
//                     'rgb(54, 162, 235)'
//                 ],
//                 hoverOffset: 4
//             }]
//         };

//         const config = {
//             type: 'doughnut',
//             data: data,
//         };

//         const ctx = document.getElementById('GraficoRosca').getContext('2d');
//         graficoRosca = new Chart(ctx, config);
//     } catch (error) {
//         console.error('Failed to fetch:', error);
//     }
// }









async function atualizarGraficoRosca(filtros) {
    // Constrói a URL com parâmetros de filtro, ignorando filtros não definidos
    let url = 'http://localhost:8080/consultas/percentagem-concluidos';
    const queryParams = new URLSearchParams(filtros);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();


        const data = {
            labels: ['Consultas Concluídas', 'Consultas Pendentes'],
            datasets: [{
                label: 'Consultas',
                data: [100, dados.percentagemConcluidos],
                backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 99, 132)'],
                hoverOffset: 4
            }]
        };

        const ctx = document.getElementById('GraficoRosca').getContext('2d');
        if (window.graficoRosca) window.graficoRosca.destroy(); // Remove o gráfico anterior, se existir
        window.graficoRosca = new Chart(ctx, { type: 'doughnut', data: data });
    } catch (error) {
        console.error("Erro ao atualizar o gráfico Rosca:", error);
    }
}



async function atualizarGraficoBarraHorizontal(filtros) {
    let url = 'http://localhost:8080/consultas/por-mes';
    const queryParams = new URLSearchParams(filtros);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        const labels = dados.meses.map(item => `Mês ${mes.mes}`);
        const dataValues = dados.map(item => item.total);

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

async function atualizarGraficoBarraDePe(filtros) {
    let url = 'http://localhost:8080/consultas/agendados-disponiveis';
    const queryParams = new URLSearchParams(filtros);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        const labels = dados.meses.map(mes => `Mês ${mes}`);
        const dataValuesAgendados = dados.agendados;
        const dataValuesDisponiveis = dados.disponiveis;

        const data = {
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
                    label: 'Disponíveis',
                    data: dataValuesDisponiveis,
                    backgroundColor: 'rgba(0, 102, 0, 0.6)',
                    borderColor: 'rgba(0, 102, 0, 1)',
                    borderWidth: 1
                }
            ]
        };

        const ctx = document.getElementById('GraficoBarraDePe').getContext('2d');
        if (window.graficoBarraDePe) window.graficoBarraDePe.destroy();
        window.graficoBarraDePe = new Chart(ctx, { type: 'bar', data: data, options: { scales: { y: { beginAtZero: true } } } });
    } catch (error) {
        console.error("Erro ao atualizar o gráfico Barra de Pé:", error);
    }
}

async function atualizarGraficoLinhaFidelizacao(filtros) {
    let url = 'http://localhost:8080/pacientes/conversoes-mes';
    const queryParams = new URLSearchParams(filtros);
    if (queryParams.toString()) url += `?${queryParams.toString()}`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        const labels = dados.meses.map(mes => `Mês ${mes}`);
        const dataValues = dados.valores;

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

        const ctx = document.getElementById('GraficoLinhaFidelizacao').getContext('2d');
        if (window.graficoLinhaFidelizacao) window.graficoLinhaFidelizacao.destroy();
        window.graficoLinhaFidelizacao = new Chart(ctx, { type: 'line', data: data });
    } catch (error) {
        console.error("Erro ao atualizar o gráfico Linha Fidelização:", error);
    }
}


function atualizarGraficosComDadosFiltrados() {
    atualizarGraficoRosca(bancoDeDadosFiltrado);
    atualizarGraficoBarraHorizontal(bancoDeDadosFiltrado);
    atualizarGraficoBarraDePe(bancoDeDadosFiltrado);
    atualizarGraficoLinhaFidelizacao(bancoDeDadosFiltrado);
}



// console.log("antes de buscar");
// buscarRosca();
// console.log("depois de buscar");


// // GRAFICO 3
// async function buscarBarraY() {
//     console.log("passei por aqui");

//     try {
//         const resposta = await fetch("http://localhost:8080/consultas/altas-ultimos-seis-meses");
//         if (!resposta.ok) {
//             throw new Error(`HTTP error! Status: ${resposta.status}`);
//         }
//         const respostaDados = await resposta.json();
//         console.log(respostaDados);

//         // Extracting the data correctly
//         const labels = respostaDados.map(item => `Mês ${item.mes}`);
//         const dataValues = respostaDados.map(item => item.total);

//         const data = {
//             labels: labels,
//             datasets: [{
//                 axis: 'y',
//                 label: 'Consultas por Mês',
//                 data: dataValues,
//                 fill: false,
//                 backgroundColor: [
//                     'rgba(255, 99, 132, 0.2)',
//                     'rgba(255, 159, 64, 0.2)',
//                     'rgba(255, 205, 86, 0.2)',
//                     'rgba(75, 192, 192, 0.2)',
//                     'rgba(54, 162, 235, 0.2)',
//                     'rgba(153, 102, 255, 0.2)',
//                     'rgba(201, 203, 207, 0.2)'
//                 ],
//                 borderColor: [
//                     'rgb(255, 99, 132)',
//                     'rgb(255, 159, 64)',
//                     'rgb(255, 205, 86)',
//                     'rgb(75, 192, 192)',
//                     'rgb(54, 162, 235)',
//                     'rgb(153, 102, 255)',
//                     'rgb(201, 203, 207)'
//                 ],
//                 borderWidth: 1
//             }]
//         };

//         const config = {
//             type: 'bar',
//             data: data,
//             options: {
//                 indexAxis: 'y',
//             }
//         };

//         const ctx = document.getElementById('GraficoBarraHorizontal').getContext('2d');
//         new Chart(ctx, config);
//     } catch (error) {
//         console.error('Failed to fetch:', error);
//     }
// }

// console.log("antes de buscar");
// buscarBarraY();
// console.log("depois de buscar");



// // GRAFICO 4


// async function buscarLinhasFidelizacao() {
//     console.log("passei por aqui");

//     try {
//         const resposta = await fetch("http://localhost:8080/pacientes/conversoes-ultimos-seis-meses");
//         if (!resposta.ok) {
//             throw new Error(`HTTP error! Status: ${resposta.status}`);
//         }
//         const respostaDados = await resposta.json();
//         console.log(respostaDados);

//         // Extracting the data correctly
//         const labels = respostaDados.map(item => `Mês ${item.mes}`);
//         const dataValues = respostaDados.map(item => item.total);

//         const data = {
//             labels: labels,
//             datasets: [{
//                 label: 'Conversões por Mês',
//                 data: dataValues,
//                 fill: false,
//                 borderColor: 'rgb(75, 192, 192)',
//                 tension: 0.1
//             }]
//         };

//         const config = {
//             type: 'line',
//             data: data,
//         };

//         const ctx = document.getElementById('GraficoLinhaFidelizacao').getContext('2d');
//         new Chart(ctx, config);
//     } catch (error) {
//         console.error('Failed to fetch:', error);
//     }
// }

// console.log("antes de buscar");
// buscarLinhasFidelizacao();
// console.log("depois de buscar");


// // GRAFICO 5 


// async function buscarBarra() {
//     console.log("passei por aqui");

//     try {
//         const resposta = await fetch("http://localhost:8080/consultas/horarios-ultimos-seis-meses");
//         if (!resposta.ok) {
//             throw new Error(`HTTP error! Status: ${resposta.status}`);
//         }
//         const respostaDados = await resposta.json();
//         console.log(respostaDados);

//         // Extracting the data correctly
//         const labels = respostaDados.map(item => `Mês ${item.mes}`);
//         const dataValuesAgendados = respostaDados.map(item => item.agendados);
//         const dataValuesDisponiveis = respostaDados.map(item => item.disponiveis);

//         const ctx = document.getElementById('GraficoBarraDePe').getContext('2d');
//         new Chart(ctx, {
//             type: 'bar',
//             data: {
//                 labels: labels,
//                 datasets: [
//                     {
//                         label: 'Agendados',
//                         data: dataValuesAgendados,
//                         backgroundColor: 'rgba(0, 204, 0, 0.6)',
//                         borderColor: 'rgba(0, 204, 0, 1)',
//                         borderWidth: 1
//                     },
//                     {
//                         label: 'Disponiveis',
//                         data: dataValuesDisponiveis,
//                         backgroundColor: 'rgba(0, 102, 0, 0.6)',
//                         borderColor: 'rgba(0, 102, 0, 1)',
//                         borderWidth: 1
//                     }
//                 ]
//             },
//             options: {
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });

//     } catch (error) {
//         console.error('Failed to fetch:', error);
//     }
// }

// console.log("antes de buscar");
// buscarBarra();
// console.log("depois de buscar");
