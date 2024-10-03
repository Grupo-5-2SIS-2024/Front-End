async function buscarMedicos() {
    try {
        // Obtém o nível de permissão e a especialização do supervisor
        const nivelPermissao = sessionStorage.getItem("PERMISSIONAMENTO_MEDICO");
        const areaEspecializacaoSupervisor = sessionStorage.getItem("ESPECIFICACAO_MEDICA");

        const resposta = await fetch("http://localhost:8080/medicos");
        const listaMedicos = await resposta.json();
        console.log("Médicos recebidos:", listaMedicos);

        // Filtra os médicos se o usuário logado for um Supervisor
        let medicosFiltrados = listaMedicos;
        if (nivelPermissao === "Supervisor") {
            medicosFiltrados = listaMedicos.filter(medico => {
                const especializacaoMedico = medico.especializacao ? medico.especializacao.toLowerCase() : '';
                const especializacaoSupervisor = areaEspecializacaoSupervisor.toLowerCase();
                
                // Compara a especialização do médico com a do supervisor
                return especializacaoMedico === especializacaoSupervisor;
            });
        }

        console.log("Médicos filtrados:", medicosFiltrados);

        const cardsMedicos = document.getElementById("listagem");
        cardsMedicos.innerHTML = medicosFiltrados.map((medico) => {
            const status = medico.ativo ? 'Ativo' : 'Inativo';

            return `
                <div class="cardColaborador" data-medico-id="${medico.id}">
                    <img src="../Assets/perfil.jpeg" alt="Foto do Colaborador">
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
                            <label for="status">Status</label>
                            <p id="status">${status}</p>
                        </div>
                        <div class="field">
                            <label for="permissao">Permissão</label>
                            <p id="permissao">${medico.permissao.nome}</p>
                        </div>
                    </div>
                    <div class="actions">
                        <button class="update"><i class="fas fa-sync-alt"></i></button>
                        <button class="delete"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.log("Erro ao buscar médicos:", e);
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



