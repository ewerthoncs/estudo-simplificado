const form = document.getElementById("form-estudo");
const lista = document.getElementById("lista-estudos");
const estatisticasDiv = document.getElementById("estatisticas");

let estudos = JSON.parse(localStorage.getItem("estudos")) || [];

function salvarNoLocalStorage() {
  localStorage.setItem("estudos", JSON.stringify(estudos));
}

function renderizarEstudos() {
  lista.innerHTML = "";
  estudos.forEach((e, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${e.data} ${e.hora_inicio}</b> - ${e.materia} (${e.assunto || "sem assunto"})<br>
      ⏱ ${e.duracao} min | Método: ${e.metodo || "não informado"} | Questões: ${e.questoes || 0}
      ${e.observacoes ? `<div>📝 ${e.observacoes}</div>` : ""}
      <button onclick="excluirEstudo(${index})">Excluir</button>
    `;
    lista.appendChild(li);
  });

  atualizarEstatisticas();
}

function atualizarEstatisticas() {
  const totalSessoes = estudos.length;
  const totalMinutos = estudos.reduce((sum, e) => sum + Number(e.duracao || 0), 0);
  const totalHoras = (totalMinutos / 60).toFixed(1);
  const totalQuestoes = estudos.reduce((sum, e) => sum + Number(e.questoes || 0), 0);
  const mediaDuracao = totalSessoes > 0 ? (totalMinutos / totalSessoes).toFixed(1) : 0;

  estatisticasDiv.innerHTML = `
    <div class="stat-card">⏱ ${totalHoras} h totais</div>
    <div class="stat-card">📚 ${totalSessoes} sessões</div>
    <div class="stat-card">❓ ${totalQuestoes} questões</div>
    <div class="stat-card">🔝 ${mediaDuracao} min/sessão</div>
  `;
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const novoEstudo = {
    data: document.getElementById("data").value,
    hora_inicio: document.getElementById("hora_inicio").value,
    duracao: document.getElementById("duracao").value,
    materia: document.getElementById("materia").value,
    assunto: document.getElementById("assunto").value,
    metodo: document.getElementById("metodo").value,
    questoes: document.getElementById("questoes").value,
    observacoes: document.getElementById("observacoes").value
  };

  estudos.push(novoEstudo);
  salvarNoLocalStorage();
  renderizarEstudos();
  form.reset();
});

function excluirEstudo(index) {
  estudos.splice(index, 1);
  salvarNoLocalStorage();
  renderizarEstudos();
}

// Inicializa a lista + estatísticas
renderizarEstudos();
