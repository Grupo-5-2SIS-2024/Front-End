async function buscarLeads() {
    try {
        const resposta = await fetch("http://localhost:8080/leads");
        const listaLeads = await resposta.json();
        console.log(listaLeads);

        // Função para formatar o CPF
        const formatarCPF = (cpf) => {
            if (!cpf) return '';
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        };

        // Função para formatar o telefone
        const formatarTelefone = (telefone) => {
            if (!telefone) return '';
            // Supondo que o telefone esteja no formato "55XXXXXXXXXX"
            return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        };

        const listaContainer = document.getElementById("listagem");
        listaContainer.innerHTML = listaLeads.map((lead) => {

            const dataEntradaFormatada = new Date(lead.dataEntrada).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

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
                            <label for="cpf">Data de Entrada</label>
                            <p id="cpf">${dataEntradaFormatada}</p>
                        </div>
                        <div class="field">
                            <label for="telefone">Telefone</label>
                            <p id="telefone">${formatarTelefone(lead.telefone)}</p>
                        </div>
                        <div class="field">
                            <label for="fase">Fase</label>
                            <p id="fase">${lead.fase}</p>
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

async function buscarKPIsLeads() {
    try {
        // Buscar o número total de leads
        const respostaTotalLeads = await fetch('http://localhost:8080/leads');
        const listaLeads = await respostaTotalLeads.json();
        const totalLeads = listaLeads.length;

        // Buscar a porcentagem de leads convertidos
        const respostaPorcentagemConvertidos = await fetch('http://localhost:8080/leads/percentual-convertidos');
        const porcentagemConvertidos = await respostaPorcentagemConvertidos.json();

        // Filtrar leads com mais de 6 meses de cadastro
        const seisMesesAtras = new Date();
        seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

        const leadsMaisDeSeisMeses = listaLeads.filter(lead => {
            const dataEntrada = new Date(lead.dataEntrada);
            return dataEntrada < seisMesesAtras;
        });
        const totalLeadsMaisDeSeisMeses = leadsMaisDeSeisMeses.length;

        // Função para adicionar zero à esquerda se necessário
        const formatarNumero = (numero) => numero.toString().padStart(2, '0');

        // Atualizar os valores nos elementos HTML, com zero à esquerda
        document.querySelector('.cardKpi:nth-child(1) .kpiNumber').textContent = formatarNumero(totalLeads);
        document.querySelector('.cardKpi:nth-child(2) .kpiNumber').textContent = porcentagemConvertidos + '%';
        document.querySelector('.cardKpi:nth-child(3) .kpiNumber').textContent = formatarNumero(totalLeadsMaisDeSeisMeses);

    } catch (erro) {
        console.error('Erro ao buscar os dados dos KPIs:', erro);
    }
}

buscarKPIsLeads();