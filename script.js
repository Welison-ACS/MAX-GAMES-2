const btnMostrarForm = document.getElementById("mostrarForm");
const btnValores = document.getElementById("btnValores");
const btnProdutos = document.getElementById("btnProdutos");
const btnConfig = document.getElementById("btnConfig");

const homeArea = document.getElementById("homeArea");
const valoresSection = document.getElementById("valoresSection");
const produtosSection = document.getElementById("produtosSection");
const configSection = document.getElementById("configSection");

const tipoSelect = document.getElementById("tipo");
const nomeSelect = document.getElementById("nome");
const tempoSelect = document.getElementById("tempo");
const adicionarBtn = document.getElementById("adicionar");

const clientesDiv = document.getElementById("clientes");
const clientesCount = document.getElementById("clientes-count");

const historicoTable = document.querySelector("#historicoTable tbody");
const limparHistBtn = document.getElementById("limparHistoricoValores");
const filtroValores = document.getElementById("filtroValores");
const totalPeriodoValores = document.getElementById("totalPeriodoValores");
const mostrarMaisValoresBtn = document.getElementById("mostrarMaisValores");

const resumoClientesAtivos = document.getElementById("resumo-clientes-ativos");
const resumoClientesTipos = document.getElementById("resumo-clientes-tipos");
const resumoTempo = document.getElementById("resumo-tempo");
const resumoProdutos = document.getElementById("resumo-produtos");
const resumoGeral = document.getElementById("resumo-geral");

const precoPS5Input = document.getElementById("precoPS5");
const precoPCInput = document.getElementById("precoPC");
const salvarPS5Btn = document.getElementById("salvarPS5");
const salvarPCBtn = document.getElementById("salvarPC");

const btnExportSistema = document.getElementById("exportSistema");
const btnImportSistema = document.getElementById("importSistema");
const importFile = document.getElementById("importFile");

const listaProdutos = document.getElementById("lista-produtos");
const abrirModalProdutoBtn = document.getElementById("abrirModalProduto");
const modalProduto = document.getElementById("modal-produto");
const produtoNomeInput = document.getElementById("produto-nome");
const produtoValorInput = document.getElementById("produto-valor");
const produtoQuantidadeInput = document.getElementById("produto-quantidade");
const salvarProdutoBtn = document.getElementById("salvarProduto");
const fecharModalProdutoBtn = document.getElementById("fecharModalProduto");
const mostrarMaisProdutosBtn = document.getElementById("mostrarMaisProdutos");

const btnModoVenda = document.getElementById("btnModoVenda");
const vendaProdutosArea = document.getElementById("vendaProdutosArea");
const buscaVendaProduto = document.getElementById("buscaVendaProduto");
const totalCarrinho = document.getElementById("totalCarrinho");
const itensCarrinho = document.getElementById("itensCarrinho");
const listaCarrinho = document.getElementById("listaCarrinho");
const finalizarVendaProdutoBtn = document.getElementById("finalizarVendaProduto");
const cancelarVendaProdutoBtn = document.getElementById("cancelarVendaProduto");

const modal = document.getElementById("modal");
const mNomeText = document.getElementById("modal-nome-text");
const mEdit = document.getElementById("modal-edit");
const mInicio = document.getElementById("modal-inicio");
const mTempo = document.getElementById("modal-tempo");
const mValor = document.getElementById("modal-valor");
const mStatus = document.getElementById("modal-status");
const mDeviceIcon = document.getElementById("modal-device-icon");
const mProdSelect = document.getElementById("modal-produtos-lista");
const mAddProdutoBtn = document.getElementById("modal-adicionar-produto");
const mLista = document.getElementById("modal-tempos-lista");
const mAddTempo = document.getElementById("modal-adicionar-tempo");
const mParar = document.getElementById("modal-parar");
const mFechar = document.getElementById("modal-fechar");

const appAlertModal = document.getElementById("app-alert-modal");
const appAlertIcon = document.getElementById("app-alert-icon");
const appAlertTitle = document.getElementById("app-alert-title");
const appAlertMessage = document.getElementById("app-alert-message");
const appAlertOk = document.getElementById("app-alert-ok");
const appAlertCancel = document.getElementById("app-alert-cancel");
const appPromptArea = document.getElementById("app-prompt-area");
const appPromptInput = document.getElementById("app-prompt-input");

let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let historico = JSON.parse(localStorage.getItem("historico")) || [];
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let carrinhoVenda = [];

let ativoIndex = null;
let limiteValores = 10;
let limiteProdutos = 8;
let modoVendaAtivo = false;

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

function getTipoLabel(tipo) {
  return tipo === "PC" ? "PC" : "PS5";
}

function getPrecoKey(tipo) {
  return tipo === "PC" ? "precoPC" : "precoPS5";
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

function abrirAviso({ titulo = "Aviso", mensagem = "", icone = "✓", tipo = "alerta", valor = "" }) {
  return new Promise(resolve => {
    appAlertTitle.textContent = titulo;
    appAlertMessage.textContent = mensagem;
    appAlertIcon.textContent = icone;

    appPromptArea.classList.toggle("escondido", tipo !== "prompt");
    appAlertCancel.classList.toggle("escondido", tipo === "alerta");

    appPromptInput.value = valor || "";

    appAlertModal.classList.remove("escondido");

    if (tipo === "prompt") {
      setTimeout(() => {
        appPromptInput.focus();
        appPromptInput.select();
      }, 80);
    }

    function finalizar(resultado) {
      appAlertModal.classList.add("escondido");
      appAlertOk.onclick = null;
      appAlertCancel.onclick = null;
      appPromptInput.onkeydown = null;
      resolve(resultado);
    }

    appAlertOk.onclick = () => {
      if (tipo === "confirmar") finalizar(true);
      else if (tipo === "prompt") finalizar(appPromptInput.value.trim());
      else finalizar(true);
    };

    appAlertCancel.onclick = () => {
      if (tipo === "confirmar") finalizar(false);
      else if (tipo === "prompt") finalizar(null);
      else finalizar(false);
    };

    appPromptInput.onkeydown = e => {
      if (e.key === "Enter") finalizar(appPromptInput.value.trim());
      if (e.key === "Escape") finalizar(null);
    };
  });
}

function appAlert(mensagem, titulo = "Pronto") {
  return abrirAviso({ titulo, mensagem, icone: "✓", tipo: "alerta" });
}

function appConfirm(mensagem, titulo = "Confirmar") {
  return abrirAviso({ titulo, mensagem, icone: "?", tipo: "confirmar" });
}

function appPrompt(mensagem, valor = "", titulo = "Editar") {
  return abrirAviso({ titulo, mensagem, icone: "✎", tipo: "prompt", valor });
}

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

precoPS5Input.value = localStorage.getItem("precoPS5") || 6;
precoPCInput.value = localStorage.getItem("precoPC") || 6;

salvarPS5Btn.onclick = async () => {
  localStorage.setItem("precoPS5", precoPS5Input.value || 0);
  atualizarResumoDia();
  await appAlert("Preço do PS5 salvo com sucesso.");
};

salvarPCBtn.onclick = async () => {
  localStorage.setItem("precoPC", precoPCInput.value || 0);
  atualizarResumoDia();
  await appAlert("Preço do PC salvo com sucesso.");
};

btnExportSistema.onclick = async () => {
  const backup = {
    versao: 1,
    geradoEm: new Date().toISOString(),
    sistema: "TecMax",
    dados: {
      clientes,
      historico,
      produtos,
      configuracoes: {
        precoPS5: localStorage.getItem("precoPS5") || "6",
        precoPC: localStorage.getItem("precoPC") || "6"
      }
    }
  };

  const data = JSON.stringify(backup, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const dataNome = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");

  a.href = url;
  a.download = `backup-tecmax-${dataNome}.json`;
  a.click();

  URL.revokeObjectURL(url);

  await appAlert("Backup do sistema exportado com sucesso.");
};

btnImportSistema.onclick = () => importFile.click();

importFile.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async evt => {
    try {
      const backup = JSON.parse(evt.target.result);

      if (!backup || !backup.dados) {
        await appAlert("Arquivo de backup inválido.", "Erro");
        importFile.value = "";
        return;
      }

      const confirmar = await appConfirm("Importar este backup? Os dados atuais serão substituídos.");

      if (!confirmar) {
        importFile.value = "";
        return;
      }

      clientes = Array.isArray(backup.dados.clientes) ? backup.dados.clientes : [];
      historico = Array.isArray(backup.dados.historico) ? backup.dados.historico : [];
      produtos = Array.isArray(backup.dados.produtos) ? backup.dados.produtos : [];

      const config = backup.dados.configuracoes || {};

      localStorage.setItem("precoPS5", config.precoPS5 || "6");
      localStorage.setItem("precoPC", config.precoPC || "6");

      precoPS5Input.value = localStorage.getItem("precoPS5") || 6;
      precoPCInput.value = localStorage.getItem("precoPC") || 6;

      salvarClientes();
      salvarHistorico();
      salvarProdutos();

      renderClientes();
      renderHistorico();
      renderProdutos();
      renderProdutosModal();
      atualizarNomeETempo();
      atualizarResumoDia();

      await appAlert("Backup importado com sucesso.");
    } catch {
      await appAlert("Arquivo de backup inválido.", "Erro");
    }

    importFile.value = "";
  };

  reader.readAsText(file);
};

function atualizarNomeETempo() {
  const tipo = tipoSelect.value;
  const label = getTipoLabel(tipo);

  nomeSelect.innerHTML = "";

  if (!tipo) {
    nomeSelect.classList.add("escondido");
    tempoSelect.classList.add("escondido");
    return;
  }

  const usados = clientes
    .filter(c => getTipoLabel(c.tipo) === label)
    .map(c => c.nome);

  let i = 1;
  while (usados.includes(`${label} ${i}`)) i++;

  nomeSelect.add(new Option(`${label} ${i}`, `${label} ${i}`));
  nomeSelect.classList.remove("escondido");
  tempoSelect.classList.remove("escondido");
}

tipoSelect.onchange = atualizarNomeETempo;

adicionarBtn.onclick = async () => {
  const tipo = tipoSelect.value;
  const nome = nomeSelect.value;
  const tMin = parseFloat(tempoSelect.value);

  if (!tipo || !nome || isNaN(tMin)) {
    await appAlert("Preencha todos os campos.", "Atenção");
    return;
  }

  const precoHora = parseFloat(localStorage.getItem(getPrecoKey(tipo))) || 0;
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

    const imagem = getTipoLabel(c.tipo) === "PC" ? "PC.png" : "ps5.jpg";

    card.innerHTML = `
      <h3>${c.nome}</h3>
      <div class="device">
        <img src="${imagem}" alt="${getTipoLabel(c.tipo)}">
      </div>
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

  const precoHora = parseFloat(localStorage.getItem(getPrecoKey(c.tipo))) || 0;
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
      atualizarStatusModal(c);
    }
  });

  atualizarResumoDia();
}, 1000);

function atualizarResumoDia() {
  const ps5Ativos = clientes.filter(c => getTipoLabel(c.tipo) === "PS5").length;
  const pcAtivos = clientes.filter(c => getTipoLabel(c.tipo) === "PC").length;

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
  mValor.textContent = valorTempoAtual.toFixed(2).replace(".", ",");
}

function atualizarStatusModal(c) {
  if (c.aberto) {
    mStatus.textContent = "Tempo aberto";
    mStatus.classList.remove("encerrado");
    return;
  }

  const rem = c.inicio + c.tMin * 60000 - Date.now();

  if (rem > 0) {
    mStatus.textContent = "Em andamento";
    mStatus.classList.remove("encerrado");
  } else {
    mStatus.textContent = "Tempo esgotado";
    mStatus.classList.add("encerrado");
  }
}

function abrirModal(idx) {
  ativoIndex = idx;

  const c = clientes[idx];
  const imagem = getTipoLabel(c.tipo) === "PC" ? "PC.png" : "ps5.jpg";

  mNomeText.textContent = c.nome;
  mDeviceIcon.innerHTML = `<img src="${imagem}" alt="${getTipoLabel(c.tipo)}">`;

  mInicio.textContent = new Date(c.inicio).toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  atualizarTempoModal(c);
  atualizarValoresModal(c);
  atualizarStatusModal(c);
  renderProdutosModal();

  const expirou = !c.aberto && Date.now() >= c.inicio + c.tMin * 60000;

  mAddTempo.classList.toggle("escondido", !expirou);
  mLista.classList.toggle("escondido", !expirou);

  modal.classList.remove("escondido");
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

mEdit.onclick = async () => {
  const novo = await appPrompt("Digite o novo nome do equipamento:", clientes[ativoIndex].nome, "Editar nome");

  if (!novo) return;

  clientes[ativoIndex].nome = novo.trim();
  salvarClientes();

  renderClientes();
  abrirModal(ativoIndex);
};

mAddProdutoBtn.onclick = async () => {
  const pi = parseInt(mProdSelect.value);
  const p = produtos[pi];

  if (!p) {
    await appAlert("Nenhum produto selecionado.", "Atenção");
    return;
  }

  const c = clientes[ativoIndex];

  c.produtos = c.produtos || [];
  c.produtos.push({
    nome: p.nome,
    valor: Number(p.valor),
    qtd: 1
  });

  salvarClientes();
  atualizarResumoDia();
  await appAlert("Produto adicionado ao consumo.");
};

mAddTempo.onclick = () => {
  const extra = parseFloat(mLista.value);
  const c = clientes[ativoIndex];

  if (!c || c.aberto || isNaN(extra)) return;

  const precoHora = parseFloat(localStorage.getItem(getPrecoKey(c.tipo))) || 0;

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
    tipo: getTipoLabel(c.tipo),
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

async function salvarProduto() {
  const nome = produtoNomeInput.value.trim();
  const valor = parseFloat(produtoValorInput.value);
  const qtd = parseInt(produtoQuantidadeInput.value) || null;

  if (!nome || isNaN(valor)) {
    await appAlert("Preencha nome e valor corretamente.", "Atenção");
    return;
  }

  produtos.push({ nome, valor, qtd });
  salvarProdutos();

  fecharModalProduto();
  renderProdutos();
  renderProdutosModal();
  await appAlert("Produto salvo com sucesso.");
}

async function removerProduto(index) {
  const confirmar = await appConfirm("Remover este produto?");

  if (!confirmar) return;

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

async function finalizarVendaProduto() {
  if (carrinhoVenda.length === 0) {
    await appAlert("Adicione produtos ao carrinho.", "Atenção");
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

  await appAlert("Venda registrada com sucesso.");
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

  listaLimitada.forEach((h) => {
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

limparHistBtn.onclick = async () => {
  const confirmar = await appConfirm("Limpar todo o histórico de valores?");

  if (!confirmar) return;

  historico = [];
  salvarHistorico();
  renderHistorico();
  atualizarResumoDia();
};

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
