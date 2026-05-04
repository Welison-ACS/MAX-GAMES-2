// script.js

// SEÇÕES
const btnMostrarForm = document.getElementById("mostrarForm");
const btnValores = document.getElementById("btnValores");
const btnProdutos = document.getElementById("btnProdutos");
const btnConfig = document.getElementById("btnConfig");

const homeArea = document.getElementById("homeArea");
const valoresSection = document.getElementById("valoresSection");
const produtosSection = document.getElementById("produtosSection");
const configSection = document.getElementById("configSection");

// FORM CLIENTE
const tipoSelect = document.getElementById("tipo");
const nomeSelect = document.getElementById("nome");
const tempoSelect = document.getElementById("tempo");
const adicionarBtn = document.getElementById("adicionar");

// CLIENTES
const clientesDiv = document.getElementById("clientes");
const clientesCount = document.getElementById("clientes-count");

// VALORES / HISTÓRICO
const historicoTable = document.querySelector("#historicoTable tbody");
const limparHistBtn = document.getElementById("limparHistoricoValores");
const filtroValores = document.getElementById("filtroValores");
const totalPeriodoValores = document.getElementById("totalPeriodoValores");
const mostrarMaisValoresBtn = document.getElementById("mostrarMaisValores");

// RESUMO FIXO
const resumoClientesAtivos = document.getElementById("resumo-clientes-ativos");
const resumoClientesTipos = document.getElementById("resumo-clientes-tipos");
const resumoTempo = document.getElementById("resumo-tempo");
const resumoProdutos = document.getElementById("resumo-produtos");
const resumoGeral = document.getElementById("resumo-geral");

// CONFIG
const precoPS5Input = document.getElementById("precoPS5");
const precoPCInput = document.getElementById("precoPC");
const salvarPS5Btn = document.getElementById("salvarPS5");
const salvarPCBtn = document.getElementById("salvarPC");

const btnExport = document.getElementById("exportClientes");
const btnImport = document.getElementById("importClientes");
const importFile = document.getElementById("importFile");

// PRODUTOS
const listaProdutos = document.getElementById("lista-produtos");
const abrirModalProdutoBtn = document.getElementById("abrirModalProduto");
const modalProduto = document.getElementById("modal-produto");
const produtoNomeInput = document.getElementById("produto-nome");
const produtoValorInput = document.getElementById("produto-valor");
const produtoQuantidadeInput = document.getElementById("produto-quantidade");
const salvarProdutoBtn = document.getElementById("salvarProduto");
const fecharModalProdutoBtn = document.getElementById("fecharModalProduto");
const mostrarMaisProdutosBtn = document.getElementById("mostrarMaisProdutos");

// VENDA PRODUTOS
const btnModoVenda = document.getElementById("btnModoVenda");
const vendaProdutosArea = document.getElementById("vendaProdutosArea");
const buscaVendaProduto = document.getElementById("buscaVendaProduto");
const totalCarrinho = document.getElementById("totalCarrinho");
const itensCarrinho = document.getElementById("itensCarrinho");
const listaCarrinho = document.getElementById("listaCarrinho");
const finalizarVendaProdutoBtn = document.getElementById("finalizarVendaProduto");
const cancelarVendaProdutoBtn = document.getElementById("cancelarVendaProduto");

// MODAL CLIENTE
const modal = document.getElementById("modal");
const mNomeText = document.getElementById("modal-nome-text");
const mEdit = document.getElementById("modal-edit");
const mInicio = document.getElementById("modal-inicio");
const mTempo = document.getElementById("modal-tempo");
const mValor = document.getElementById("modal-valor");
const mConsumosList = document.getElementById("modal-consumos");
const mTotalProdutos = document.getElementById("modal-total-produtos");
const mTotalGeral = document.getElementById("modal-total-geral");
const mProdSelect = document.getElementById("modal-produtos-lista");
const mAddProdutoBtn = document.getElementById("modal-adicionar-produto");
const mLista = document.getElementById("modal-tempos-lista");
const mAddTempo = document.getElementById("modal-adicionar-tempo");
const mParar = document.getElementById("modal-parar");
const mFechar = document.getElementById("modal-fechar");

// DADOS
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let historico = JSON.parse(localStorage.getItem("historico")) || [];
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let carrinhoVenda = [];

let ativoIndex = null;
let limiteValores = 10;
let limiteProdutos = 8;
let modoVendaAtivo = false;

// UTIL
function moeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function formatDuration(ms) {
  if (ms < 0) ms = 0;

  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function hojeISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function isHoje(dataISO) {
  if (!dataISO) return false;
  return new Date(dataISO).toISOString().slice(0, 10) === hojeISO();
}

function salvarClientes() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

function salvarHistorico() {
  localStorage.setItem("historico", JSON.stringify(historico));
}

function salvarProdutos() {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

// SEÇÕES
function setActiveButton(btn) {
  [btnMostrarForm, btnValores, btnProdutos, btnConfig].forEach(b => {
    b.classList.remove("ativo");
  });

  btn.classList.add("ativo");
}

function esconderTudo() {
  homeArea.classList.add("escondido");
  valoresSection.classList.add("escondido");
  produtosSection.classList.add("escondido");
  configSection.classList.add("escondido");
}

function mostrarMenuHome() {
  esconderTudo();
  homeArea.classList.remove("escondido");
  setActiveButton(btnMostrarForm);
}

function mostrarMenuValores() {
  esconderTudo();
  valoresSection.classList.remove("escondido");
  setActiveButton(btnValores);
  limiteValores = 10;
  renderHistorico();
}

function mostrarMenuProdutos() {
  esconderTudo();
  produtosSection.classList.remove("escondido");
  setActiveButton(btnProdutos);
  limiteProdutos = 8;
  renderProdutos();
}

function mostrarMenuConfig() {
  esconderTudo();
  configSection.classList.remove("escondido");
  setActiveButton(btnConfig);
}

btnMostrarForm.onclick = mostrarMenuHome;
btnValores.onclick = mostrarMenuValores;
btnProdutos.onclick = mostrarMenuProdutos;
btnConfig.onclick = mostrarMenuConfig;

// CONFIG
precoPS5Input.value = localStorage.getItem("precoPS5") || 6;
precoPCInput.value = localStorage.getItem("precoPC") || 6;

salvarPS5Btn.onclick = () => {
  localStorage.setItem("precoPS5", precoPS5Input.value || 0);
  atualizarResumoDia();
  alert("Preço PS5 salvo!");
};

salvarPCBtn.onclick = () => {
  localStorage.setItem("precoPC", precoPCInput.value || 0);
  atualizarResumoDia();
  alert("Preço PC salvo!");
};

// IMPORT / EXPORT
btnExport.onclick = () => {
  const data = JSON.stringify(clientes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "clientes-ativos.json";
  a.click();

  URL.revokeObjectURL(url);
};

btnImport.onclick = () => importFile.click();

importFile.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = evt => {
    try {
      const data = JSON.parse(evt.target.result);

      if (!Array.isArray(data)) {
        alert("Arquivo inválido.");
        return;
      }

      clientes = data;
      salvarClientes();
      renderClientes();
      atualizarResumoDia();
      alert("Clientes importados.");
    } catch {
      alert("Arquivo inválido.");
    }
  };

  reader.readAsText(file);
};

// FORM CLIENTE
function atualizarNomeETempo() {
  const tipo = tipoSelect.value;

  nomeSelect.innerHTML = "";

  if (!tipo) {
    nomeSelect.classList.add("escondido");
    tempoSelect.classList.add("escondido");
    return;
  }

  const usados = clientes.filter(c => c.tipo === tipo).map(c => c.nome);

  let i = 1;
  while (usados.includes(`${tipo} ${i}`)) i++;

  nomeSelect.add(new Option(`${tipo} ${i}`, `${tipo} ${i}`));
  nomeSelect.classList.remove("escondido");
  tempoSelect.classList.remove("escondido");
}

tipoSelect.onchange = atualizarNomeETempo;

adicionarBtn.onclick = () => {
  const tipo = tipoSelect.value;
  const nome = nomeSelect.value;
  const tMin = parseFloat(tempoSelect.value);

  if (!tipo || !nome || isNaN(tMin)) {
    alert("Preencha todos os campos.");
    return;
  }

  const key = tipo === "PS5" ? "precoPS5" : "precoPC";
  const precoHora = parseFloat(localStorage.getItem(key)) || 0;
  const valor = tMin > 0 ? (tMin / 60) * precoHora : 0;

  clientes.push({
    tipo,
    nome,
    tMin,
    valor,
    inicio: Date.now(),
    alertado: false,
    aberto: tMin === 0,
    produtos: []
  });

  salvarClientes();
  renderClientes();
  atualizarNomeETempo();
  atualizarResumoDia();
};

// CLIENTES
function renderClientes() {
  clientesDiv.innerHTML = "";

  clientesCount.textContent = `${clientes.length} ${clientes.length === 1 ? "ativo" : "ativos"}`;

  if (clientes.length === 0) {
    clientesDiv.innerHTML = `<p class="empty-message">Nenhum cliente ativo.</p>`;
    return;
  }

  clientes.forEach((c, idx) => {
    const card = document.createElement("div");
    card.className = "client-card";
    card.onclick = () => abrirModal(idx);

    card.innerHTML = `
      <h3>${c.nome}</h3>
      <div class="device">${c.tipo === "PS5" ? "🎮" : "🖥️"}</div>
      <div class="timer cliente-tempo">00:00:00</div>
    `;

    clientesDiv.appendChild(card);
  });
}

function calcularValorTempoCliente(c) {
  if (!c) return 0;

  if (!c.aberto) {
    return Number(c.valor || 0);
  }

  const key = c.tipo === "PS5" ? "precoPS5" : "precoPC";
  const precoHora = parseFloat(localStorage.getItem(key)) || 0;
  const minutos = (Date.now() - c.inicio) / 60000;

  return (minutos / 60) * precoHora;
}

setInterval(() => {
  document.querySelectorAll(".client-card").forEach((card, idx) => {
    const c = clientes[idx];
    if (!c) return;

    const timer = card.querySelector(".cliente-tempo");
    if (!timer) return;

    if (c.aberto) {
      timer.textContent = formatDuration(Date.now() - c.inicio);
      timer.classList.remove("timer-fim");
    } else {
      const rem = c.inicio + c.tMin * 60000 - Date.now();

      if (rem > 0) {
        timer.textContent = formatDuration(rem);
        timer.classList.remove("timer-fim");
      } else {
        timer.textContent = "00:00:00";
        timer.classList.add("timer-fim");

        if (!c.alertado) {
          c.alertado = true;
          salvarClientes();

          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Tempo esgotado", {
              body: `${c.nome} acabou!`
            });
          }
        }
      }
    }

    if (ativoIndex === idx && !modal.classList.contains("escondido")) {
      atualizarTempoModal(c);
      atualizarValoresModal(c);
    }
  });

  atualizarResumoDia();
}, 1000);

// RESUMO DO DIA
function atualizarResumoDia() {
  const ps5Ativos = clientes.filter(c => c.tipo === "PS5").length;
  const pcAtivos = clientes.filter(c => c.tipo === "PC").length;

  const historicoHoje = historico.filter(h => isHoje(h.data));

  const totalTempoHistorico = historicoHoje.reduce((s, h) => s + Number(h.valorTempo || 0), 0);
  const totalProdutosHistorico = historicoHoje.reduce((s, h) => s + Number(h.totalProdutos || 0), 0);

  const totalTempoAtivo = clientes.reduce((s, c) => s + calcularValorTempoCliente(c), 0);
  const totalProdutosAtivos = clientes.reduce((s, c) => {
    return s + (c.produtos || []).reduce((sp, p) => sp + Number(p.valor || 0) * Number(p.qtd || 0), 0);
  }, 0);

  const totalTempo = totalTempoHistorico + totalTempoAtivo;
  const totalProdutos = totalProdutosHistorico + totalProdutosAtivos;
  const totalGeral = totalTempo + totalProdutos;

  resumoClientesAtivos.textContent = String(clientes.length).padStart(2, "0");
  resumoClientesTipos.textContent = `${ps5Ativos} PS5 / ${pcAtivos} PC`;
  resumoTempo.textContent = moeda(totalTempo);
  resumoProdutos.textContent = moeda(totalProdutos);
  resumoGeral.textContent = moeda(totalGeral);
}

// MODAL CLIENTE
function atualizarTempoModal(c) {
  if (c.aberto) {
    mTempo.textContent = formatDuration(Date.now() - c.inicio);
    return;
  }

  const rem = c.inicio + c.tMin * 60000 - Date.now();
  mTempo.textContent = rem > 0 ? formatDuration(rem) : "00:00:00";
}

function atualizarValoresModal(c) {
  const valorTempoAtual = calcularValorTempoCliente(c);
  const totalProdutos = (c.produtos || []).reduce((s, p) => s + p.valor * p.qtd, 0);

  mValor.textContent = valorTempoAtual.toFixed(2).replace(".", ",");
  mTotalProdutos.textContent = totalProdutos.toFixed(2).replace(".", ",");
  mTotalGeral.textContent = (valorTempoAtual + totalProdutos).toFixed(2).replace(".", ",");
}

function abrirModal(idx) {
  ativoIndex = idx;

  const c = clientes[idx];

  mNomeText.textContent = c.nome;
  mInicio.textContent = new Date(c.inicio).toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  atualizarTempoModal(c);
  atualizarValoresModal(c);

  renderConsumosModal(c);
  renderProdutosModal();

  const expirou = !c.aberto && Date.now() >= c.inicio + c.tMin * 60000;

  mAddTempo.classList.toggle("escondido", !expirou);
  mLista.classList.toggle("escondido", !expirou);

  modal.classList.remove("escondido");
}

function renderConsumosModal(c) {
  mConsumosList.innerHTML = "";

  if (!c.produtos || c.produtos.length === 0) {
    mConsumosList.innerHTML = "<li>— nenhum —</li>";
  } else {
    c.produtos.forEach((p, i) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <span>${p.nome} (x${p.qtd}) — ${moeda(p.valor * p.qtd)}</span>
        <button class="cons-remove" data-i="${i}">🗑️</button>
      `;

      mConsumosList.appendChild(li);
    });

    mConsumosList.querySelectorAll(".cons-remove").forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();

        const index = parseInt(btn.dataset.i);
        c.produtos.splice(index, 1);

        salvarClientes();
        abrirModal(ativoIndex);
        atualizarResumoDia();
      };
    });
  }

  atualizarValoresModal(c);
}

function renderProdutosModal() {
  if (produtos.length === 0) {
    mProdSelect.innerHTML = `<option value="">Nenhum produto cadastrado</option>`;
    return;
  }

  mProdSelect.innerHTML = produtos.map((p, i) => {
    return `<option value="${i}">${p.nome} — ${moeda(p.valor)}</option>`;
  }).join("");
}

mFechar.onclick = () => {
  modal.classList.add("escondido");
};

mEdit.onclick = () => {
  const novo = prompt("Novo nome:", clientes[ativoIndex].nome);

  if (!novo) return;

  clientes[ativoIndex].nome = novo.trim();
  salvarClientes();

  renderClientes();
  abrirModal(ativoIndex);
};

mAddProdutoBtn.onclick = () => {
  const pi = parseInt(mProdSelect.value);
  const p = produtos[pi];

  if (!p) return;

  const c = clientes[ativoIndex];

  c.produtos = c.produtos || [];
  c.produtos.push({
    nome: p.nome,
    valor: Number(p.valor),
    qtd: 1
  });

  salvarClientes();
  abrirModal(ativoIndex);
  atualizarResumoDia();
};

mAddTempo.onclick = () => {
  const extra = parseFloat(mLista.value);
  const c = clientes[ativoIndex];

  if (!c || c.aberto || isNaN(extra)) return;

  const key = c.tipo === "PS5" ? "precoPS5" : "precoPC";
  const precoHora = parseFloat(localStorage.getItem(key)) || 0;

  c.tMin = extra;
  c.inicio = Date.now();
  c.valor += (extra / 60) * precoHora;
  c.alertado = false;

  salvarClientes();

  renderClientes();
  abrirModal(ativoIndex);
  atualizarResumoDia();
};

mParar.onclick = () => {
  pararCliente(ativoIndex);
};

function pararCliente(idx) {
  const c = clientes[idx];

  if (!c) return;

  const totalProdutos = (c.produtos || []).reduce((sum, p) => {
    return sum + (p.valor * p.qtd);
  }, 0);

  const valorTempoFinal = calcularValorTempoCliente(c);

  const entry = {
    nome: c.nome,
    tipo: c.tipo,
    valorTempo: valorTempoFinal,
    produtos: c.produtos || [],
    totalProdutos,
    totalGeral: valorTempoFinal + totalProdutos,
    data: new Date().toISOString(),
    status: null
  };

  historico.push(entry);
  salvarHistorico();

  clientes.splice(idx, 1);
  salvarClientes();

  modal.classList.add("escondido");
  ativoIndex = null;

  renderClientes();
  renderHistorico();
  atualizarNomeETempo();
  atualizarResumoDia();
}

// PRODUTOS
function produtosFiltradosParaVenda() {
  const termo = buscaVendaProduto.value.trim().toLowerCase();

  if (!termo) return produtos;

  return produtos.filter(p => {
    return p.nome.toLowerCase().includes(termo);
  });
}

function renderProdutos() {
  listaProdutos.innerHTML = "";

  const baseProdutos = modoVendaAtivo ? produtosFiltradosParaVenda() : produtos;
  const listaLimitada = baseProdutos.slice(0, limiteProdutos);

  if (baseProdutos.length === 0) {
    listaProdutos.innerHTML = `<p class="empty-message">Nenhum produto encontrado.</p>`;
    mostrarMaisProdutosBtn.classList.add("escondido");
    return;
  }

  listaLimitada.forEach((p) => {
    const indexReal = produtos.indexOf(p);

    const row = document.createElement("div");
    row.className = "product-row";

    row.innerHTML = `
      <div>
        <strong>${p.nome}</strong>
        <small>${p.qtd ? `Quantidade: ${p.qtd}` : "Sem quantidade definida"}</small>
      </div>

      <div class="product-actions">
        <span>${moeda(p.valor)}</span>
        ${
          modoVendaAtivo
            ? `<button class="btn-add-carrinho" onclick="adicionarProdutoCarrinho(${indexReal})">+</button>`
            : `<button onclick="removerProduto(${indexReal})">Remover</button>`
        }
      </div>
    `;

    listaProdutos.appendChild(row);
  });

  if (baseProdutos.length > limiteProdutos) {
    mostrarMaisProdutosBtn.classList.remove("escondido");
  } else {
    mostrarMaisProdutosBtn.classList.add("escondido");
  }
}

function abrirModalProduto() {
  produtoNomeInput.value = "";
  produtoValorInput.value = "";
  produtoQuantidadeInput.value = "";
  modalProduto.classList.remove("escondido");
  produtoNomeInput.focus();
}

function fecharModalProduto() {
  modalProduto.classList.add("escondido");
}

function salvarProduto() {
  const nome = produtoNomeInput.value.trim();
  const valor = parseFloat(produtoValorInput.value);
  const qtd = parseInt(produtoQuantidadeInput.value) || null;

  if (!nome || isNaN(valor)) {
    alert("Preencha nome e valor corretamente.");
    return;
  }

  produtos.push({ nome, valor, qtd });
  salvarProdutos();

  fecharModalProduto();
  renderProdutos();
  renderProdutosModal();
}

function removerProduto(index) {
  if (!confirm("Remover este produto?")) return;

  produtos.splice(index, 1);
  salvarProdutos();
  renderProdutos();
}

function ativarModoVenda() {
  modoVendaAtivo = true;
  carrinhoVenda = [];
  limiteProdutos = 8;

  vendaProdutosArea.classList.remove("escondido");
  btnModoVenda.classList.add("modo-ativo");
  btnModoVenda.textContent = "Modo venda";

  buscaVendaProduto.value = "";
  buscaVendaProduto.focus();

  renderCarrinho();
  renderProdutos();
}

function cancelarModoVenda() {
  modoVendaAtivo = false;
  carrinhoVenda = [];
  limiteProdutos = 8;

  vendaProdutosArea.classList.add("escondido");
  btnModoVenda.classList.remove("modo-ativo");
  btnModoVenda.textContent = "Vender Produto";

  buscaVendaProduto.value = "";

  renderCarrinho();
  renderProdutos();
}

function adicionarProdutoCarrinho(index) {
  const produto = produtos[index];
  if (!produto) return;

  const itemExistente = carrinhoVenda.find(item => item.nome === produto.nome && item.valor === Number(produto.valor));

  if (itemExistente) {
    itemExistente.qtd += 1;
  } else {
    carrinhoVenda.push({
      nome: produto.nome,
      valor: Number(produto.valor),
      qtd: 1
    });
  }

  renderCarrinho();
}

function removerItemCarrinho(index) {
  carrinhoVenda.splice(index, 1);
  renderCarrinho();
}

function renderCarrinho() {
  listaCarrinho.innerHTML = "";

  const total = carrinhoVenda.reduce((s, p) => s + p.valor * p.qtd, 0);
  const qtdItens = carrinhoVenda.reduce((s, p) => s + p.qtd, 0);

  totalCarrinho.textContent = moeda(total);
  itensCarrinho.textContent = `${qtdItens} ${qtdItens === 1 ? "item" : "itens"}`;

  if (carrinhoVenda.length === 0) {
    listaCarrinho.innerHTML = `<p class="empty-message carrinho-vazio">Carrinho vazio.</p>`;
    return;
  }

  carrinhoVenda.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "carrinho-item";

    div.innerHTML = `
      <span>${item.nome} x${item.qtd}</span>
      <strong>${moeda(item.valor * item.qtd)}</strong>
      <button onclick="removerItemCarrinho(${index})">×</button>
    `;

    listaCarrinho.appendChild(div);
  });
}

function finalizarVendaProduto() {
  if (carrinhoVenda.length === 0) {
    alert("Adicione produtos ao carrinho.");
    return;
  }

  const totalProdutos = carrinhoVenda.reduce((s, p) => s + p.valor * p.qtd, 0);

  historico.push({
    nome: "Venda de produtos",
    tipo: "Produto",
    valorTempo: 0,
    produtos: carrinhoVenda,
    totalProdutos,
    totalGeral: totalProdutos,
    data: new Date().toISOString(),
    status: null
  });

  salvarHistorico();

  cancelarModoVenda();
  atualizarResumoDia();

  if (!valoresSection.classList.contains("escondido")) {
    renderHistorico();
  }

  alert("Venda registrada.");
}

abrirModalProdutoBtn.onclick = abrirModalProduto;
fecharModalProdutoBtn.onclick = fecharModalProduto;
salvarProdutoBtn.onclick = salvarProduto;

btnModoVenda.onclick = () => {
  if (modoVendaAtivo) {
    cancelarModoVenda();
  } else {
    ativarModoVenda();
  }
};

cancelarVendaProdutoBtn.onclick = cancelarModoVenda;
finalizarVendaProdutoBtn.onclick = finalizarVendaProduto;

buscaVendaProduto.oninput = () => {
  limiteProdutos = 8;
  renderProdutos();
};

mostrarMaisProdutosBtn.onclick = () => {
  limiteProdutos += 8;
  renderProdutos();
};

// HISTÓRICO
function filtrarHistoricoPorPeriodo() {
  const filtro = filtroValores.value;

  const ordenado = [...historico].sort((a, b) => {
    return new Date(b.data) - new Date(a.data);
  });

  if (filtro === "todos") return ordenado;

  const agora = new Date();

  if (filtro === "hoje") {
    return ordenado.filter(h => isHoje(h.data));
  }

  const dias = Number(filtro);
  const limite = new Date();
  limite.setDate(agora.getDate() - dias);

  return ordenado.filter(h => {
    return new Date(h.data) >= limite;
  });
}

function renderHistorico() {
  historicoTable.innerHTML = "";

  const filtrado = filtrarHistoricoPorPeriodo();
  const totalPeriodo = filtrado.reduce((s, h) => s + Number(h.totalGeral || 0), 0);
  const listaLimitada = filtrado.slice(0, limiteValores);

  totalPeriodoValores.textContent = moeda(totalPeriodo);

  if (filtrado.length === 0) {
    historicoTable.innerHTML = `
      <tr>
        <td colspan="4">Nenhum registro encontrado.</td>
      </tr>
    `;

    mostrarMaisValoresBtn.classList.add("escondido");
    return;
  }

  listaLimitada.forEach((h, i) => {
    const indexReal = historico.indexOf(h);
    const tr = document.createElement("tr");

    if (h.status === "paid") tr.classList.add("paid");
    if (h.status === "pending") tr.classList.add("pending");

    tr.innerHTML = `
      <td>${h.nome}</td>
      <td>${h.tipo}</td>
      <td>${moeda(h.totalGeral)}</td>
      <td>${new Date(h.data).toLocaleDateString("pt-BR")}</td>
    `;

    tr.ondblclick = () => abrirDetalhesHistorico(h, indexReal);

    historicoTable.appendChild(tr);
  });

  if (filtrado.length > limiteValores) {
    mostrarMaisValoresBtn.classList.remove("escondido");
  } else {
    mostrarMaisValoresBtn.classList.add("escondido");
  }
}

function abrirDetalhesHistorico(h, index) {
  const md = document.createElement("div");
  md.className = "modal";

  md.innerHTML = `
    <div class="modal-content">
      <h2>${h.nome} — ${h.tipo}</h2>

      <p><strong>Data:</strong> ${new Date(h.data).toLocaleString("pt-BR")}</p>
      <p><strong>Tempo:</strong> ${moeda(h.valorTempo)}</p>

      <h3>Produtos</h3>

      <ul class="historico-lista-produtos">
        ${
          h.produtos && h.produtos.length > 0
            ? h.produtos.map(p => `<li>${p.nome} (x${p.qtd}) — ${moeda(p.valor * p.qtd)}</li>`).join("")
            : "<li>— nenhum —</li>"
        }
      </ul>

      <p><strong>Total produtos:</strong> ${moeda(h.totalProdutos)}</p>
      <p><strong>Total geral:</strong> ${moeda(h.totalGeral)}</p>

      <div class="modal-actions">
        <button id="btnDevendo" class="primary-btn secundario">Devendo</button>
        <button id="btnPago" class="primary-btn">Pago</button>
        <button id="fecharHistDetalhes" class="primary-btn secundario">Fechar</button>
      </div>
    </div>
  `;

  document.body.appendChild(md);

  document.getElementById("fecharHistDetalhes").onclick = () => md.remove();

  document.getElementById("btnDevendo").onclick = () => {
    historico[index].status = "pending";
    salvarHistorico();
    renderHistorico();
    atualizarResumoDia();
    md.remove();
  };

  document.getElementById("btnPago").onclick = () => {
    historico[index].status = "paid";
    salvarHistorico();
    renderHistorico();
    atualizarResumoDia();
    md.remove();
  };
}

filtroValores.onchange = () => {
  limiteValores = 10;
  renderHistorico();
};

mostrarMaisValoresBtn.onclick = () => {
  limiteValores += 10;
  renderHistorico();
};

limparHistBtn.onclick = () => {
  if (!confirm("Limpar histórico?")) return;

  historico = [];
  salvarHistorico();
  renderHistorico();
  atualizarResumoDia();
};

// INIT
window.onload = () => {
  historico = historico.map(h => {
    return h.status === undefined ? { ...h, status: null } : h;
  });

  clientes = clientes.map(c => {
    return {
      ...c,
      aberto: c.aberto === true || Number(c.tMin) === 0
    };
  });

  salvarHistorico();
  salvarClientes();

  mostrarMenuHome();
  renderClientes();
  renderHistorico();
  renderProdutos();
  atualizarNomeETempo();
  atualizarResumoDia();

  if ("Notification" in window) {
    Notification.requestPermission();
  }
};