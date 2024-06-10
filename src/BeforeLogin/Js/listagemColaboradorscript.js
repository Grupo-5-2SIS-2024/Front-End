async function buscar() {
  console.log("Passei por aqui");

  const resposta = await fetch("URL_PARA_API_COLABORADORES");
  const respostaDadosColaboradores = await resposta.json();

  console.log("Resposta:", respostaDadosColaboradores);

  const cards = document.getElementById("cards_colaboradores");

  cards.innerHTML = respostaDadosColaboradores.map((colaborador) => {
      return `
      <div class="colaboradorItem">
          <img class="foto" src="${colaborador.urlFoto}" alt="Foto de ${colaborador.nome}">
          <div class="informacoes">
              <p><strong>Nome:</strong> ${colaborador.nome} ${colaborador.sobrenome}</p>
              <p><strong>Email:</strong> ${colaborador.email}</p>
              <p><strong>Status:</strong> ${colaborador.ativo ? 'Ativo' : 'Inativo'}</p>
              <p><strong>Permissão:</strong> ${colaborador.permissao ? colaborador.permissao.descricao : 'Sem permissão'}</p>
              <button onclick="toggleStatus(${colaborador.id}, ${colaborador.ativo})">
                  ${colaborador.ativo ? 'Desativar' : 'Ativar'}
              </button>
          </div>
      </div>
      `;
  }).join('');
}

async function toggleStatus(colaboradorId, isActive) {
  const newStatus = !isActive;
  const resposta = await fetch(`URL_PARA_API_COLABORADORES/${colaboradorId}`, {
      method: 'PATCH',
      body: JSON.stringify({ ativo: newStatus }),
      headers: { "Content-type": "application/json; charset=UTF-8" }
  });

  if (resposta.ok) {
      buscar(); // Refresh the list after updating the status
  } else {
      alert('Erro ao atualizar status do colaborador');
  }
}

console.log("antes de buscar");
buscar();
console.log("Depois de buscar");
