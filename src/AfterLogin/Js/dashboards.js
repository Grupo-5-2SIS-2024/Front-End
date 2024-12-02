// Variáveis globais para os gráficos
let graficos = {};

// Função genérica para criar gráficos
function criarGrafico(ctxId, tipo, dados, opcoes = {}) {
    if (graficos[ctxId]) graficos[ctxId].destroy(); // Destroi o gráfico existente, se houver
    const ctx = document.getElementById(ctxId).getContext('2d');
    graficos[ctxId] = new Chart(ctx, { type: tipo, data: dados, options: opcoes });
}

// Função para buscar dados genéricos
async function fetchDados(url, filtros = {}) {
    const queryParams = new URLSearchParams(filtros).toString();
    const fullUrl = queryParams ? `${url}?${queryParams}` : url;

    try {
        const resposta = await fetch(fullUrl);
        if (!resposta.ok) throw new Error(`Erro ao buscar dados: ${resposta.status}`);
        return await resposta.json();
    } catch (error) {
        console.error(`Erro ao buscar dados de ${url}:`, error);
        return null;
    }
}

// Função para atualizar gráfico Rosca
async function atualizarGraficoRosca(filtros = {}) {
    const url = 'http://localhost:8080/consultas/percentagem-concluidos';
    const dados = await fetchDados(url, filtros);

    if (dados) {
        criarGrafico('GraficoRosca', 'doughnut', {
            labels: ['Concluídas', 'Pendentes'],
            datasets: [{
                data: [dados.realizadas, dados.total],
                backgroundColor: ['#36A2EB', '#FF6384'],
            }],
        });
    }
}









// Função para atualizar gráfico de Barra Horizontal
async function atualizarGraficoBarraHorizontal(filtros = {}) {
    const url = 'http://localhost:8080/consultas/altas-ultimos-seis-meses'; // URL corrigida para buscar os dados corretos

    try {
        const dados = await fetchDados(url, filtros); // Chama a função genérica de busca de dados

        if (dados) {
            // Mapeia os rótulos e os valores
            const labels = dados.map(item => `Mês ${item.mes}`);
            const dataValues = dados.map(item => item.total);

            // Cria o gráfico usando a função genérica
            criarGrafico('GraficoBarraHorizontal', 'bar', {
                labels: labels,
                datasets: [{
                    label: 'Consultas por Mês',
                    data: dataValues,
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
            }, {
                indexAxis: 'y' // Configura para barras horizontais
            });
        } else {
            console.warn('Nenhum dado foi retornado para criar o gráfico.');
        }
    } catch (error) {
        console.error('Erro ao atualizar o gráfico de barra horizontal:', error);
    }
}




async function atualizarGraficoBarraDePe(filtros = {}) {
    console.log("Iniciando atualização do gráfico de barras de pé");

    const url = 'http://localhost:8080/consultas/horarios-ultimos-seis-meses';
    const dados = await fetchDados(url, filtros);

    if (dados) {
        console.log("Dados recebidos:", dados);

        // Preparando os dados para o gráfico
        const labels = dados.map(item => `Mês ${item.mes} de ${item.ano} `);
        const agendados = dados.map(item => item.agendados);
        const disponiveis = dados.map(item => item.disponiveis);

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Agendados',
                    data: agendados,
                    backgroundColor: 'rgba(76, 175, 80, 0.6)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Disponíveis',
                    data: disponiveis,
                    backgroundColor: 'rgba(255, 193, 7, 0.6)',
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 1,
                },
            ],
        };

        const opcoes = {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };

        criarGrafico('GraficoBarraDePe', 'bar', data, opcoes);
        console.log("Gráfico atualizado com sucesso");
    } else {
        console.error("Falha ao receber os dados para o gráfico");
    }
}

// Função para atualizar gráfico de Linhas
async function atualizarGraficoLinhaFidelizacao(filtros = {}) {
    const url = 'http://localhost:8080/pacientes/conversoes-ultimos-seis-meses';
    const dados = await fetchDados(url, filtros);

    if (dados) {
        criarGrafico('GraficoLinhaFidelizacao', 'line', {
            labels: dados.dataConversao,
            datasets: [{
                label: 'Conversões',
                data: dados.totalConvertidos,
                borderColor: '#FF5722',
                fill: false,
            }],
        });
    }
}





async function buscarTabela() {
    console.log("Iniciando busca de agendamentos...");

    try {
        // Faz a requisição para o endpoint
        const resposta = await fetch("http://localhost:8080/consultas/agendamentosProximos");
        if (!resposta.ok) {
            throw new Error(`Erro HTTP! Status: ${resposta.status}`);
        }

        // Converte a resposta para JSON
        const respostaDados = await resposta.json();
        console.log("Dados recebidos:", respostaDados);

        // Seleciona a tabela
        const tabela = document.getElementById("tableUpcomingAppointments");

        // Remove todas as linhas, exceto o cabeçalho
        tabela.innerHTML = `
            <tr>
                <th>Paciente</th>
                <th>Vencimento</th>
                <th>Especialidade</th>
            </tr>
        `;

        // Adiciona os dados na tabela
        respostaDados.forEach(item => {
            // Formata a data de vencimento
            const dataObj = new Date(item.dataConsulta);
            const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
            const horarioFormatado = dataObj.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
            });

            // Cria uma nova linha para a tabela
            const novaLinha = `
                <tr>
                    <td>${item.nomePaciente}</td>
                    <td>${dataFormatada} ${horarioFormatado}</td>
                    <td>${item.especialidadeMedico}</td>
                </tr>
            `;

            tabela.innerHTML += novaLinha;
        });

        console.log("Tabela atualizada com sucesso.");
    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
    }
}

// Executa a função ao carregar
console.log("Antes de buscar");
buscarTabela();
console.log("Depois de buscar");
















// Função para inicializar gráficos
async function inicializarGraficos() {
    // Inicializa os gráficos sem filtros
    await atualizarGraficoRosca();
    await atualizarGraficoBarraHorizontal();
    await atualizarGraficoBarraDePe();
    await atualizarGraficoLinhaFidelizacao();
}

// Função para aplicar filtros
async function aplicarFiltros() {
    const filtros = {
        medicoId: document.getElementById('filtroMedicoS').value,
        pacienteId: document.getElementById('filtroPaciente').value,
        statusId: document.getElementById('filtroStatus').value,
        areaConsultaId: document.getElementById('filtroAreaConsulta').value,
        idadePaciente: document.getElementById('filtroIdade').value,
        generoPaciente: document.getElementById('filtroGenero').value,
        dataInicio: document.getElementById('filtroDataInicio').value,
        dataFim: document.getElementById('filtroDataFim').value,
    };

    await atualizarGraficoRosca(filtros);
    await atualizarGraficoBarraHorizontal(filtros);
    await atualizarGraficoBarraDePe(filtros);
    await atualizarGraficoLinhaFidelizacao(filtros);
    fecharModalFiltro();
}

// Função para limpar filtros
function limparFiltros() {
    document.querySelectorAll('#modalFiltro select, #modalFiltro input').forEach(input => input.value = '');
    inicializarGraficos(); // Exibe gráficos com todos os dados novamente
}

// Função para preencher os campos de filtro
async function preencherCamposDeFiltro() {
    const medicos = await fetchDados('http://localhost:8080/medicos');
    const pacientes = await fetchDados('http://localhost:8080/pacientes');
    const status = await fetchDados('http://localhost:8080/statusConsultas');
    const areas = await fetchDados('http://localhost:8080/especificacoes');

    // Preenche os filtros com as opções disponíveis
    preencherSelect('filtroMedicoS', medicos, 'id', 'nome');
    preencherSelect('filtroPaciente', pacientes, 'id', 'nome');
    preencherSelect('filtroStatus', status, 'id', 'nomeStatus');
    preencherSelect('filtroAreaConsulta', areas, 'id', 'area');
}

// Função para preencher select com dados
function preencherSelect(elementId, dados, valorKey, textoKey) {
    const select = document.getElementById(elementId);
    select.innerHTML = '<option value="">Todos</option>';
    if (dados && Array.isArray(dados)) {
        dados.forEach(item => {
            select.innerHTML += `<option value="${item[valorKey]}">${item[textoKey]}</option>`;
        });
    }
}

// Função para abrir e fechar modal
function abrirModalFiltro() {
    document.getElementById('modalFiltro').style.display = 'flex';
}

function fecharModalFiltro() {
    document.getElementById('modalFiltro').style.display = 'none';
}

// Inicializar página
(async function inicializarPagina() {
    await preencherCamposDeFiltro(); // Preenche os campos de filtro
    await inicializarGraficos(); // Inicializa gráficos com todos os dados
})();
