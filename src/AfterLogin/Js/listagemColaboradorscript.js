async function buscarMedicos() {
    try {
        const nivelPermissao = sessionStorage.getItem("PERMISSIONAMENTO_MEDICO");
        const areaEspecializacaoSupervisor = sessionStorage.getItem("ESPECIFICACAO_MEDICA");
        const idMedicoLogado = Number(sessionStorage.getItem("ID_MEDICO")); // Convertendo o ID do médico logado para número

        const resposta = await fetch("http://localhost:8080/medicos");
        const listaMedicos = await resposta.json();
        console.log("Médicos recebidos:", listaMedicos);

        // 1. Filtrar o médico logado
        let medicosFiltrados = listaMedicos.filter(medico => medico.id !== idMedicoLogado);

        // 2. Se for Supervisor, filtrar pela especialização correspondente
        if (nivelPermissao === "Supervisor" && areaEspecializacaoSupervisor) {
            const especializacaoSupervisor = areaEspecializacaoSupervisor.trim().toLowerCase();
            medicosFiltrados = medicosFiltrados.filter(medico => {
                const especializacaoMedico = medico.especificacaoMedica && medico.especificacaoMedica.area ? medico.especificacaoMedica.area.trim().toLowerCase() : '';
                return especializacaoMedico === especializacaoSupervisor;
            });
        }

        console.log("Médicos filtrados:", medicosFiltrados);

        const cardsMedicos = document.getElementById("listagem");
        cardsMedicos.innerHTML = medicosFiltrados.map((medico) => {
            const status = medico.ativo ? 'Ativo' : 'Inativo';
            const foto = medico.foto === null || medico.foto === undefined ? "../Assets/perfil.jpeg" : medico.foto;

            // Verifica se o nível de permissão é Supervisor e remove os botões de atualizar e deletar
            const acoes = nivelPermissao === "Supervisor" ? '' : `
                <div class="actions">
                    <button class="update"><i class="fas fa-pencil-alt"></i></button>
                    <button class="delete"><i class="fas fa-trash-alt"></i></button>
                </div>`;

            return `
                <div class="cardColaborador" data-medico-id="${medico.id}">
                    <img src="${foto}" alt="Foto do Colaborador">
                    <div class="info">
                        <div class="field">
                            <label for="nome">Nome</label>
                            <p id="nome">${medico.nome} ${medico.sobrenome}</p>
                        </div>
                        <div class="field">
                            <label for="email">Email</label>
                            <p id="email">${medico.email}</p>
                        </div>
                        <div class="field">
                            <label for="especificacaoMedica">Especificação</label>
                            <p id="especificacaoMedica">${medico.especificacaoMedica.area}</p>
                        </div>
                        <div class="field">
                            <label for="status">Status</label>
                            <p id="status">${status}</p>
                        </div>
                        <div class="field">
                            <label for="permissao">Permissão</label>
                            <p id="permissao">${medico.permissao.nome}</p>
                        </div>
                    </div>
                    ${acoes} <!-- Inclui ou remove ações baseado na permissão -->
                </div>
            `;
        }).join('');

        // Adiciona eventos de clique para os botões de exclusão e atualização, se não for Supervisor
        if (nivelPermissao !== "Supervisor") {
            cardsMedicos.querySelectorAll('.delete').forEach((botao) => {
                botao.addEventListener('click', function () {
                    const card = this.closest('.cardColaborador');
                    const id = card.dataset.medicoId;

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
                                deletarMedico(id);
                            }
                        });
                    } else {
                        console.error('ID do médico não encontrado.');
                    }
                });
            });

            cardsMedicos.querySelectorAll('.update').forEach((botao) => {
                botao.addEventListener('click', function () {
                    const card = this.closest('.cardColaborador');
                    const id = card.dataset.medicoId;

                    if (id) {
                        window.location.href = `atualizarColaborador.html?id=${id}`;
                    } else {
                        console.error('ID do médico não encontrado.');
                    }
                });
            });
        }
    } catch (e) {
        console.log(e);
    }
}

buscarMedicos();


async function deletarMedico(id) {
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

        // Deleta o médico
        const resposta4 = await fetch(`http://localhost:8080/medicos/${id}`, {
            method: 'DELETE'
        });
        if (!resposta4.ok) {
            throw new Error(`Erro ao deletar médico: ${resposta4.statusText}`);
        }

        // Se todas as operações forem bem-sucedidas, exibe a mensagem e recarrega a lista de médicos
        console.log('Médico deletado com sucesso.');
        buscarMedicos();
    } catch (erro) {
        console.error('Erro ao deletar médico:', erro);
    }
}

async function buscarKPIsMedico() {
    try {
        // Buscar o número total de médicos
        const respostaTotalMedicos = await fetch('http://localhost:8080/medicos');
        const listaMedicos = await respostaTotalMedicos.json();
        const totalMedicos = listaMedicos.length;

        // Buscar o número de médicos ativos
        const medicosAtivos = listaMedicos.filter(medico => medico.ativo).length;

        // Buscar o total de administradores
        const respostaTotalAdmins = await fetch('http://localhost:8080/medicos/totalAdministradores');
        const totalAdmins = await respostaTotalAdmins.json();
        console.log('Total de administradores:', totalAdmins);

        // Buscar o número de administradores ativos
        const respostaAdminsAtivos = await fetch('http://localhost:8080/medicos/totalAdministradoresAtivos');
        const totalAdminsAtivos = await respostaAdminsAtivos.json();

        // Função para adicionar zero à esquerda se necessário
        const formatarNumero = (numero) => numero.toString().padStart(2, '0');

        // Atualizar os valores nos elementos HTML, com zero à esquerda
        document.querySelector('.cardKpi:nth-child(1) .kpiNumber').textContent = formatarNumero(totalMedicos);
        document.querySelector('.cardKpi:nth-child(2) .kpiNumber').textContent = formatarNumero(medicosAtivos);
        document.querySelector('.cardKpi:nth-child(3) .kpiNumber').textContent = formatarNumero(totalAdmins);
        document.querySelector('.cardKpi:nth-child(4) .kpiNumber').textContent = formatarNumero(totalAdminsAtivos);

    } catch (erro) {
        console.error('Erro ao buscar os dados dos KPIs:', erro);
    }
}

buscarKPIsMedico();



