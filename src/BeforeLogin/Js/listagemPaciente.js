async function buscarPacientes() {
    try {
        const resposta = await fetch("http://localhost:8080/pacientes");
        const listaPacientes = await resposta.json();
        console.log(listaPacientes);

        const cardsMedicos = document.getElementById("listagem");
        cardsMedicos.innerHTML = listaPacientes.map((entry) => {
            const paciente = entry.paciente;
            const nomeMedico = entry.nomeMedico || 'Médico não associado';
            const especialidadeMedica = entry.especialidadeMedica || 'Especialidade não informada';
            const status = paciente.ativo ? 'Ativo' : 'Inativo';

            return `
                <div class="cardPaciente" data-paciente-id="${paciente.id}">
                    <div class="info">
                        <div class="field">
                            <label for="nome">Nome</label>
                            <p id="nome">${paciente.nome} ${paciente.sobrenome}</p>
                        </div>
                        <div class="field">
                            <label for="contato">Contato</label>
                            <p id="contato">${paciente.telefone}</p>
                        </div>
                        <div class="field">
                            <label for="responsavel">Responsável</label>
                            <p id="responsavel">${paciente.responsavel ? paciente.responsavel.nome : 'Não informado'}</p>
                        </div>
                        <div class="field">
                            <label for="medico">Médico</label>
                            <p id="medico">${nomeMedico}</p>
                        </div>
                        <div class="field">
                            <label for="especialidade">Especialidade</label>
                            <p id="especialidade">${especialidadeMedica}</p>
                        </div>
                    </div>
                    <div class="actions">
                        <button class="update"><i class="fas fa-sync-alt"></i></button>
                        <button class="delete"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            `;
        }).join('');

        // Adiciona evento de clique para os botões de exclusão
        cardsMedicos.querySelectorAll('.delete').forEach((botao) => {
            botao.addEventListener('click', function () {
                const card = this.closest('.cardPaciente');
                const id = card.dataset.pacienteId;

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
                            // Se o usuário confirmar, chama a função de deletar
                            deletarPaciente(id);
                        }
                    });
                } else {
                    console.error('ID do paciente não encontrado.');
                }
            });
        });

        cardsMedicos.querySelectorAll('.update').forEach((botao) => {
            botao.addEventListener('click', function () {
                const card = this.closest('.cardPaciente');
                const id = card.dataset.pacienteId;

                if (id) {
                    window.location.href = `atualizarColaborador.html?id=${id}`;
                } else {
                    console.error('ID do paciente não encontrado.');
                }
            });
        });
    } catch (e) {
        console.log(e);
    }
}

buscarPacientes();

async function deletarPaciente(id) {
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

        // Deleta o paciente
        const resposta4 = await fetch(`http://localhost:8080/pacientes/${id}`, {
            method: 'DELETE'
        });
        if (!resposta4.ok) {
            throw new Error(`Erro ao deletar paciente: ${resposta4.statusText}`);
        }

        // Se todas as operações forem bem-sucedidas, exibe a mensagem e recarrega a lista de pacientes
        console.log('Paciente deletado com sucesso.');
        buscarPacientes();
    } catch (erro) {
        console.error('Erro ao deletar paciente:', erro);
    }
}
