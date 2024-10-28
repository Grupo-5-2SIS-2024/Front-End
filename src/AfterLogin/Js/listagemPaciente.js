async function buscarPacientes() {
    // Obtenha os dados do sessionStorage
    const permissionamentoMedico = sessionStorage.getItem("PERMISSIONAMENTO_MEDICO");
    const especificacaoMedicaArea = sessionStorage.getItem("ESPECIFICACAO_MEDICA");

    try {
        let listaPacientes = [];

        
        if (permissionamentoMedico === "Admin") {
            const resposta = await fetch("http://localhost:8080/pacientes");
            listaPacientes = await resposta.json();
        } 
     
        else if (permissionamentoMedico === "Supervisor" && especificacaoMedicaArea) {
         
            const respostaPacientes = await fetch("http://localhost:8080/pacientes");
            const todosPacientes = await respostaPacientes.json();

          
            const respostaConsultas = await fetch("http://localhost:8080/consultas");
            const todasConsultas = await respostaConsultas.json();

        
            listaPacientes = todosPacientes.filter(paciente => {
            
                return todasConsultas.some(consulta => 
                    consulta.paciente.id === paciente.id &&
                    consulta.especificacaoMedica.area === especificacaoMedicaArea 
                );
            });
        } else {
            console.warn("Permissão ou especificação médica não definida.");
            return;
        }

        console.log("Pacientes filtrados:", listaPacientes);

       
        const cardsMedicos = document.getElementById("listagem");
        cardsMedicos.innerHTML = listaPacientes.map((paciente) => {
            const responsavel = paciente.responsavel ? `${paciente.responsavel.nome} ${paciente.responsavel.sobrenome}` : 'Não informado';

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
                            <p id="responsavel">${responsavel}</p>
                        </div>
                        <div class="field">
                            <label for="dataNascimento">Data de Nascimento</label>
                            <p id="dataNascimento">${paciente.dataNascimento}</p>
                        </div>
                        <div class="field">
                            <label for="cpf">CPF</label>
                            <p id="cpf">${paciente.cpf}</p>
                        </div>
                    </div>
                    <div class="actions">
                        <button class="update"><i class="fas fa-pencil-alt"></i></button>
                        <button class="delete"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            `;
        }).join('');

        
        adicionarEventosBotoes(cardsMedicos);
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
