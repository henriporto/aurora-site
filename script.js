// URL pública do servidor MCP. Trocar aqui atualiza todas as instruções.
const URL_MCP = "https://mcp.auroravoto.com.br/mcp";
const NOME = "aurora";

const json = (obj) => JSON.stringify(obj, null, 2);

// Cada cliente: passos (HTML curto), blocos de código e, se houver, botão de instalação em 1 clique.
const CLIENTES = [
  {
    id: "claude",
    nome: "claude.ai",
    passos: [
      "No computador, abra <strong>claude.ai</strong> → <strong>Configurações</strong> → <strong>Conectores</strong>.",
      "Clique em <strong>Adicionar conector personalizado</strong>, dê o nome <strong>Aurora</strong> e cole a URL abaixo.",
      "Clique em <strong>Conectar</strong> e entre com sua conta Google.",
    ],
    codigos: [{ rotulo: "URL do conector", texto: URL_MCP }],
    nota: "Depois de adicionado, o conector também aparece no app do celular.",
  },
  {
    id: "chatgpt",
    nome: "ChatGPT",
    passos: [
      "Abra <strong>Configurações</strong> → <strong>Apps e conectores</strong> → <strong>Configurações avançadas</strong> e ative o <strong>modo desenvolvedor</strong>.",
      "Volte em <strong>Apps e conectores</strong> e clique em <strong>Criar</strong>.",
      "Cole a URL abaixo, escolha autenticação <strong>OAuth</strong> e entre com sua conta Google.",
    ],
    codigos: [{ rotulo: "URL do servidor MCP", texto: URL_MCP }],
    nota: "O modo desenvolvedor depende do seu plano do ChatGPT.",
  },
  {
    id: "claude-code",
    nome: "Claude Code",
    passos: [
      "Rode o comando abaixo no terminal.",
      "Abra o Claude Code, digite <kbd>/mcp</kbd>, escolha <strong>aurora</strong> e entre com sua conta Google.",
    ],
    codigos: [{ rotulo: "terminal", texto: `claude mcp add --transport http ${NOME} ${URL_MCP}` }],
  },
  {
    id: "gemini-cli",
    nome: "Gemini CLI",
    passos: [
      "Rode o comando abaixo no terminal.",
      "Abra o Gemini CLI e rode <kbd>/mcp auth aurora</kbd> para entrar com sua conta Google.",
    ],
    codigos: [{ rotulo: "terminal", texto: `gemini mcp add --transport http ${NOME} ${URL_MCP}` }],
  },
  {
    id: "vscode",
    nome: "VS Code",
    instalar: {
      rotulo: "Instalar no VS Code",
      href: "vscode:mcp/install?" + encodeURIComponent(JSON.stringify({ name: NOME, type: "http", url: URL_MCP })),
    },
    passos: [
      "Clique em <strong>Instalar no VS Code</strong> ou rode o comando abaixo.",
      "No chat do Copilot, em modo <strong>Agent</strong>, a Aurora aparece nas ferramentas. Entre com sua conta Google quando pedir.",
    ],
    codigos: [
      { rotulo: "terminal", texto: `code --add-mcp '${JSON.stringify({ name: NOME, type: "http", url: URL_MCP })}'` },
      { rotulo: ".vscode/mcp.json", texto: json({ servers: { [NOME]: { type: "http", url: URL_MCP } } }) },
    ],
  },
  {
    id: "cursor",
    nome: "Cursor",
    instalar: {
      rotulo: "Instalar no Cursor",
      href: `cursor://anysphere.cursor-deeplink/mcp/install?name=${NOME}&config=` + btoa(JSON.stringify({ url: URL_MCP })),
    },
    passos: [
      "Clique em <strong>Instalar no Cursor</strong> ou cole a configuração abaixo no arquivo indicado.",
      "Em <strong>Settings</strong> → <strong>MCP</strong>, clique em <strong>Connect</strong> na Aurora e entre com sua conta Google.",
    ],
    codigos: [{ rotulo: "~/.cursor/mcp.json", texto: json({ mcpServers: { [NOME]: { url: URL_MCP } } }) }],
  },
  {
    id: "antigravity",
    nome: "Antigravity",
    passos: [
      "No painel do agente, abra o menu <strong>⋯</strong> → <strong>MCP Servers</strong> → <strong>Manage MCP Servers</strong> → <strong>View raw config</strong>.",
      "Adicione a Aurora como abaixo, salve e entre com sua conta Google quando pedir.",
    ],
    codigos: [{ rotulo: "mcp_config.json", texto: json({ mcpServers: { [NOME]: { serverUrl: URL_MCP } } }) }],
  },
  {
    id: "windsurf",
    nome: "Windsurf",
    passos: [
      "Abra <strong>Settings</strong> → <strong>Cascade</strong> → <strong>MCP Servers</strong> → <strong>View raw config</strong>.",
      "Adicione a Aurora como abaixo, salve e entre com sua conta Google quando pedir.",
    ],
    codigos: [{ rotulo: "~/.codeium/windsurf/mcp_config.json", texto: json({ mcpServers: { [NOME]: { serverUrl: URL_MCP } } }) }],
  },
  {
    id: "outros",
    nome: "Outros",
    passos: [
      "Adicione um servidor MCP remoto do tipo <strong>HTTP</strong> (Streamable HTTP).",
      "Cole a URL abaixo. A autenticação é OAuth, com login Google.",
    ],
    codigos: [{ rotulo: "URL do servidor MCP", texto: URL_MCP }],
  },
];

const ICONE_COPIAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
const ICONE_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

const abas = document.getElementById("abas");
const painel = document.getElementById("painel");
const aviso = document.getElementById("aviso");

const escapar = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

async function copiar(texto) {
  try {
    await navigator.clipboard.writeText(texto);
  } catch {
    // Fallback para navegadores embutidos (ex.: Instagram) sem Clipboard API.
    const area = document.createElement("textarea");
    area.value = texto;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
}

let timerAviso;
function mostrarAviso(msg) {
  aviso.textContent = msg;
  aviso.classList.add("visivel");
  clearTimeout(timerAviso);
  timerAviso = setTimeout(() => aviso.classList.remove("visivel"), 1800);
}

function renderizarPainel(cliente) {
  const instalar = cliente.instalar
    ? `<a class="botao botao--acento" href="${cliente.instalar.href}">${cliente.instalar.rotulo}</a>`
    : "";
  const codigos = cliente.codigos
    .map(
      (c, i) => `
      <div class="codigo">
        <div class="codigo__barra">
          <span class="codigo__rotulo">${escapar(c.rotulo)}</span>
          <button type="button" class="copiar" data-indice="${i}" aria-label="Copiar ${escapar(c.rotulo)}">${ICONE_COPIAR}<span>Copiar</span></button>
        </div>
        <pre><code>${escapar(c.texto)}</code></pre>
      </div>`
    )
    .join("");

  painel.innerHTML = `
    ${instalar ? `<div class="painel__instalar">${instalar}</div>` : ""}
    <ol class="passos">${cliente.passos.map((p) => `<li><span>${p}</span></li>`).join("")}</ol>
    ${codigos}
    ${cliente.nota ? `<p class="painel__nota">${cliente.nota}</p>` : ""}
  `;
  painel.setAttribute("aria-labelledby", `aba-${cliente.id}`);

  painel.querySelectorAll(".copiar").forEach((botao) => {
    botao.addEventListener("click", async () => {
      await copiar(cliente.codigos[Number(botao.dataset.indice)].texto);
      botao.innerHTML = `${ICONE_OK}<span>Copiado</span>`;
      botao.dataset.copiado = "";
      setTimeout(() => {
        botao.innerHTML = `${ICONE_COPIAR}<span>Copiar</span>`;
        delete botao.dataset.copiado;
      }, 1800);
    });
  });

  painel.classList.remove("entrando");
  void painel.offsetWidth; // reinicia a animação
  painel.classList.add("entrando");
}

function selecionar(id, { focar = false, rolar = true } = {}) {
  const cliente = CLIENTES.find((c) => c.id === id) ?? CLIENTES[0];
  abas.querySelectorAll(".aba").forEach((aba) => {
    const ativa = aba.dataset.id === cliente.id;
    aba.setAttribute("aria-selected", String(ativa));
    aba.tabIndex = ativa ? 0 : -1;
    if (ativa) {
      if (focar) aba.focus();
      if (rolar) aba.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  });
  renderizarPainel(cliente);
  try { localStorage.setItem("aurora-cliente", cliente.id); } catch {}
}

abas.innerHTML = CLIENTES.map(
  (c) => `<button type="button" role="tab" class="aba" id="aba-${c.id}" data-id="${c.id}" aria-controls="painel" aria-selected="false" tabindex="-1">${c.nome}</button>`
).join("");

// Degradê nas bordas só quando há abas escondidas daquele lado.
const trilho = abas.parentElement;
function atualizarBordas() {
  const fim = abas.scrollWidth - abas.clientWidth;
  trilho.classList.toggle("tem-antes", abas.scrollLeft > 2);
  trilho.classList.toggle("tem-depois", abas.scrollLeft < fim - 2);
}
abas.addEventListener("scroll", atualizarBordas, { passive: true });
window.addEventListener("resize", atualizarBordas);

// Roda do mouse rola a fileira na horizontal quando ela não cabe na tela.
abas.addEventListener("wheel", (e) => {
  if (abas.scrollWidth <= abas.clientWidth || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
  e.preventDefault();
  abas.scrollLeft += e.deltaY;
}, { passive: false });

abas.addEventListener("click", (e) => {
  const aba = e.target.closest(".aba");
  if (aba) selecionar(aba.dataset.id);
});

// Setas, Home e End navegam entre as abas (padrão WAI-ARIA).
abas.addEventListener("keydown", (e) => {
  const ids = CLIENTES.map((c) => c.id);
  const atual = ids.indexOf(document.activeElement?.dataset.id);
  if (atual < 0) return;
  const destino = { ArrowRight: atual + 1, ArrowLeft: atual - 1, Home: 0, End: ids.length - 1 }[e.key];
  if (destino === undefined) return;
  e.preventDefault();
  selecionar(ids[(destino + ids.length) % ids.length], { focar: true });
});

let inicial = CLIENTES[0].id;
try { inicial = localStorage.getItem("aurora-cliente") || inicial; } catch {}
selecionar(inicial, { rolar: false });
atualizarBordas();

// Perguntas de exemplo: tocar copia.
document.querySelectorAll(".pergunta").forEach((botao) => {
  botao.addEventListener("click", async () => {
    const pergunta = botao.cloneNode(true);
    pergunta.querySelectorAll(".etiqueta").forEach((e) => e.remove());
    await copiar(pergunta.textContent.trim());
    mostrarAviso("Pergunta copiada");
  });
});
