async function buscarLeads() {
    try {
        const resposta = await fetch("http://localhost:8080/leads");
        const listaLeads = await resposta.json();
        console.log(listaLeads);

        const listaContainer = document.getElementById("listagem");
        listaContainer.innerHTML = listaLeads.map((lead) => {

            console.log(lead);
            return `
                <div class="cardLead" data-lead-id="${lead.id}">
                    <div class="info">
                        <div class="field">
                            <label for="nome">Nome</label>
                            <p id="nome">${lead.nome} ${lead.sobrenome}</p>
                        </div>
                        <div class="field">
                            <label for="email">Email</label>
                            <p id="email">${lead.email}</p>
                        </div>
                        <div class="field">
                            <label for="cpf">CPF</label>
                            <p id="cpf">${lead.cpf}</p>
                        </div>
                        <div class="field">
                            <label for="telefone">Telefone</label>
                            <p id="telefone">${lead.telefone}</p>
                        </div>
                        <div class="field">
                            <label for="fase">Fase</label>
                            <p id="fase">${lead.tipoDeContato.faseContato}</p>
                        </div>
                    </div>
                    <div class="actions">
                        <button class="delete"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            `;
        }).join('');

        // Adiciona evento de clique para os botões de exclusão
        listaContainer.querySelectorAll('.delete').forEach((botao) => {
            botao.addEventListener('click', function () {
                const card = this.closest('.cardLead');
                const id = card.dataset.leadId;

                if (id) {
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
                            deletarLead(id);
                        }
                    });
                } else {
                    console.error('ID do lead não encontrado.');
                }
            });
        });

    } catch (e) {
        console.error('Erro ao buscar leads:', e);
    }
}

async function deletarLead(id) {
    try {
        const resposta = await fetch(`http://localhost:8080/leads/${id}`, {
            method: 'DELETE'
        });
        if (!resposta.ok) {
            throw new Error(`Erro ao deletar lead: ${resposta.statusText}`);
        }
        console.log('Lead deletado com sucesso.');
        buscarLeads();
    } catch (erro) {
        console.error('Erro ao deletar lead:', erro);
    }
}

// Chama a função para listar os leads ao carregar a página
buscarLeads();