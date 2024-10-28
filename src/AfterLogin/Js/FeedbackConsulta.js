const urlParams = new URLSearchParams(window.location.search);
const consultaId = urlParams.get('consultaId');
const viewOnly = urlParams.get('viewOnly') === 'true';

// Variável para armazenar os dados da consulta
let consultaAtual;

// Função para buscar todas as consultas, filtrar pelo ID e preencher o formulário
async function carregarDadosConsulta() {
    try {
        const resposta = await fetch("http://localhost:8080/consultas");
        if (!resposta.ok) {
            throw new Error(`Erro ao buscar dados das consultas. Status: ${resposta.status}`);
        }
        const consultas = await resposta.json();
        console.log("Dados de todas as consultas recebidos:", consultas);

        consultaAtual = consultas.find(c => c.id === consultaId);
        if (!consultaAtual) {
            console.warn("Consulta não encontrada com o ID especificado.");
            alert("Consulta não encontrada.");
            return;
        }

        if (consultaAtual.medico) {
            document.getElementById("medico").value = `${consultaAtual.medico.nome} ${consultaAtual.medico.sobrenome}`;
        } else {
            document.getElementById("medico").value = "Médico não disponível";
        }

        if (consultaAtual.especificacaoMedica) {
            document.getElementById("especificacaoMedica").value = consultaAtual.especificacaoMedica.area;
        } else {
            document.getElementById("especificacaoMedica").value = "Especialidade não disponível";
        }

        if (consultaAtual.paciente) {
            document.getElementById("paciente").value = `${consultaAtual.paciente.nome} ${consultaAtual.paciente.sobrenome}`;
        } else {
            document.getElementById("paciente").value = "Paciente não disponível";
        }

        // Se o acompanhamento existir, preenche os campos "resumo" e "relatorio"
        if (consultaAtual.acompanhamento) {
            document.getElementById("resumo").value = consultaAtual.acompanhamento.resumo || "";
            document.getElementById("relatorio").value = consultaAtual.acompanhamento.relatorio || "";
        }
    } catch (error) {
        console.error('Erro ao carregar os dados da consulta:', error);
    }
}async function concluirConsultaEAdicionarFeedback(idConsulta) {
    console.log("Iniciando conclusão da consulta com ID:", idConsulta);

    try {
        // Buscar todas as consultas
        const respostaConsulta = await fetch(`http://localhost:8080/consultas`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Accept": "application/json"
            }
        });

        if (!respostaConsulta.ok) {
            throw new Error(`Erro HTTP! Status: ${respostaConsulta.status}`);
        }

        const consultas = await respostaConsulta.json();
        console.log("Consultas existentes recebidas:", consultas);

        // Localizar a consulta específica pelo ID
        const consultaExistente = consultas.find(consulta => consulta.id === idConsulta);
        if (!consultaExistente) {
            throw new Error('Consulta não encontrada.');
        }

        // Atualizar o status para "Concluída"
        const consultaAtualizada = {
            ...consultaExistente,
            statusConsulta: { id: 2 } // Define o status como "Concluída" (ID = 2)
        };

        console.log("Dados da consulta a serem atualizados:", consultaAtualizada);

        // Envia a requisição PUT para atualizar a consulta
        const respostaAtualizacao = await fetch(`http://localhost:8080/consultas/${idConsulta}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(consultaAtualizada),
        });

        if (!respostaAtualizacao.ok) {
            const erro = await respostaAtualizacao.text();
            throw new Error(`Erro ao atualizar o status da consulta: ${erro}`);
        }

        console.log("Status da consulta atualizado para 'Concluída'.");

        // Após o sucesso do PUT, chama a função para adicionar o acompanhamento
        adicionarAcompanhamento(idConsulta);
    } catch (error) {
        console.error('Erro ao concluir a consulta:', error);
        alert("Ocorreu um erro ao concluir a consulta. Tente novamente.");
    }
}

// Função para adicionar o feedback na tabela de acompanhamento
// Função para adicionar o feedback na tabela de acompanhamento
async function adicionarAcompanhamento(idConsulta) {
    const resumo = document.getElementById("resumo").value;
    const relatorio = document.getElementById("relatorio").value;

    // Construindo o objeto com os dados necessários
    const dadosFeedback = {
        resumo: resumo,
        relatorio: relatorio,
        consulta: { id: idConsulta },  // Define "consulta" como um objeto com o ID
        status_consulta: 2             // Define o status do acompanhamento como "Concluída"
    };

    console.log("Dados de feedback a serem enviados:", dadosFeedback);

    try {
        const respostaFeedback = await fetch("http://localhost:8080/acompanhamentos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosFeedback),
        });

        if (!respostaFeedback.ok) {
            const erroTexto = await respostaFeedback.text();
            throw new Error(`Erro ao salvar feedback. Status: ${respostaFeedback.status}. Detalhes: ${erroTexto}`);
        }

        console.log("Feedback salvo com sucesso!");
        alert("Feedback salvo com sucesso!");
        window.location.href = "addAgendamento.html";
    } catch (error) {
        console.error('Erro ao salvar o feedback:', error);
        alert("Ocorreu um erro ao salvar o feedback. Tente novamente.");
    }
}





// Chamar a função para carregar dados da consulta ao abrir a página
carregarDadosConsulta();
