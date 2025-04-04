const contatos = [
  {
    nome: "João da Silva",
    classificacao: "Beneficiário",
    carteirinha: "123456789",
    idade: 42,
    plano: "Plano 400",
    acomodacao: "Apartamento",
    celular: "(11) 91234-5678",
    email: "joao@email.com",
    canais: ["whatsapp", "email", "app"]
  },
  {
    nome: "Dra. Ana Costa",
    classificacao: "Prestador",
    carteirinha: "CRM4321",
    celular: "(21) 99876-5432",
    email: "ana@clinica.com",
    canais: ["whatsapp", "email", "portal"]
  }
];

const templates = {
  whatsapp: {
    "Conversar agora": `Somos do Plano de Saúde. Estamos entrando em contato pois temos informações importantes sobre uma solicitação médica (pedido: {{NUM_PEDIDO}}) registrada em seu nome. Podemos conversar?\n----\nCaso desconheça este pedido, por favor, desconsidere esta mensagem.`,
    "Notificação genérica": `Somos do Plano de Saúde. Informamos que o status do seu pedido {{NUM_PEDIDO}} foi atualizado. Utilize os canais de atendimento oficiais do plano para obter mais informações.\n\n💻 Portal: https://seuplano.com.br\n📍 App iOS: https://apps.apple.com/br/app/seuplano/id471890526\n📍 App Android: https://play.google.com/store/apps/SeuPlano\nAté mais! 👋\n----\nCaso desconheça este pedido, por favor, desconsidere esta mensagem.`,
    "Solicitação de Documentação (Beneficiário)": `Solicitação de Documento (Notificação automática)\nProcedimento: {{NOME_PROC}}\nCaro(a) {{NOME_CLIENTE}}:\nPara seguirmos com a análise de autorização do seu procedimento, precisamos do documento {{NOME_DOC}} até a data limite de {{DT_LIMITE}}.\n\nEle pode ser enviado por você para o email {{EMAIL_DOC}} ou anexado pelo seu médico no Portal .\n\nAtenciosamente,\nRegulação`,
    "Status do Pedido": `Caro(a) {{NOME_CLIENTE}}:\nSeu pedido de autorização segue em análise. Estamos trabalhando para finalizar dentro do prazo.\nPrazo estimado: {{DT_CONCLUSAO}}.\nVocê pode acompanhar pelo Portal.\n\nAtenciosamente,\nRegulação`,
    "Solicitação de Documentação (Prestador)": `Olá {{Nome do Médico}}, Para seguirmos com a análise de autorização do pedido do seu paciente {{Nome do Paciente}} no pedido {{Numero do Pedido}}, precisamos do documento {{NOME_DOC}} até a data limite de {{DT_LIMITE}}. Ele pode ser enviado por você para o email {{EMAIL_DOC}} ou anexado, diretamente ao seu pedido, através do Portal.\n\nAtenciosamente,\nRegulação`,
    "Negociação (Prestador)": `Olá {{Nome do Médico}}, Somos da Regulação. Estamos entrando em contato pois temos informações importantes sobre os itens solicitados no pedido: {{NUM_PEDIDO}}. Podemos conversar?\n----\nCaso desconheça este pedido, por favor, desconsidere esta mensagem.`
  }
};

let contatoSelecionado = null;
let canaisSelecionados = [];

function showTab(tab) {
  document.getElementById("contact-list").style.display = tab === "contacts" ? "block" : "none";
  document.getElementById("history-list").style.display = tab === "history" ? "block" : "none";
  document.getElementById("form-container").innerHTML = "<p>Selecione um contato e um tipo de mensagem para começar.</p>";
  canaisSelecionados = [];
  contatoSelecionado = null;
}

function renderContacts() {
  const area = document.getElementById("contact-list");
  area.innerHTML = contatos.map((c, i) => `
    <div class="contact-card">
      <h4>${c.nome}</h4>
      <div class="classification">${c.classificacao}</div>
      <div class="icon-buttons">
        ${c.canais.includes("whatsapp") ? `<i class="fa-brands fa-whatsapp" onclick="selecionarCanal(${i}, 'whatsapp')"></i>` : ""}
        ${c.canais.includes("email") ? `<i class="fa-solid fa-envelope" onclick="selecionarCanal(${i}, 'email')"></i>` : ""}
        ${c.canais.includes("portal") ? `<i class="fa-solid fa-network-wired" onclick="selecionarCanal(${i}, 'portal')"></i>` : ""}
        ${c.canais.includes("app") ? `<i class="fa-solid fa-mobile" onclick="selecionarCanal(${i}, 'app')"></i>` : ""}
      </div>
    </div>
  `).join('');
}

function selecionarCanal(index, canal) {
  if (contatoSelecionado !== index) {
    contatoSelecionado = index;
    canaisSelecionados = [];
  }
  if (!canaisSelecionados.includes(canal)) canaisSelecionados.push(canal);
  renderFormulario();
}

function renderFormulario() {
  const c = contatos[contatoSelecionado];
  const isBeneficiario = c.classificacao === "Beneficiário";
  const header = `
    <div class="contact-header">
      <h2>${c.nome}</h2>
      <ul>
        ${isBeneficiario ? `<li><strong>Carteirinha:</strong> ${c.carteirinha}</li>
        <li><strong>Idade:</strong> ${c.idade}</li>
        <li><strong>Plano:</strong> ${c.plano}</li>
        <li><strong>Acomodação:</strong> ${c.acomodacao}</li>` : ""}
        <li><strong>Celular:</strong> ${c.celular}</li>
        <li><strong>E-mail:</strong> ${c.email}</li>
      </ul>
    </div>
  `;

  const forms = canaisSelecionados.map(canal => {
    const keys = Object.keys(templates[canal] || {});
    const options = keys.map(t => `<option value="${t}">${t}</option>`).join("");
    return `
      <div>
        <h3>${canal.toUpperCase()}</h3>
        <label>Template:</label>
        <select onchange="aplicarTemplate('${canal}', this)">
          <option value="">Selecione...</option>
          ${options}
        </select>
        <textarea id="msg-${canal}" rows="4"></textarea>
      </div>
    `;
  }).join('');

  document.getElementById("form-container").innerHTML = `
    ${header}
    <form onsubmit="enviar(event)">
      <div id="formFields">${forms}</div>
      <div id="channel-actions">
        <button type="submit">Enviar Todas</button>
        <button type="button" onclick="showTab('contacts')">Cancelar</button>
      </div>
    </form>
  `;
}

function aplicarTemplate(canal, select) {
  const chave = select.value;
  if (!chave) return;
  const c = contatos[contatoSelecionado];
  let texto = templates[canal][chave]
    .replace(/{{NOME_CLIENTE}}/g, c.nome)
    .replace(/{{Nome do Médico}}/g, c.nome)
    .replace(/{{NUM_PEDIDO}}/g, "123456")
    .replace(/{{Numero do Pedido}}/g, "123456")
    .replace(/{{Nome do Paciente}}/g, "João da Silva")
    .replace(/{{NOME_PROC}}/g, "Ressonância Magnética")
    .replace(/{{NOME_DOC}}/g, "Pedido Médico")
    .replace(/{{DT_LIMITE}}/g, "31/04/2025")
    .replace(/{{DT_CONCLUSAO}}/g, "01/05/2025")
    .replace(/{{EMAIL_DOC}}/g, "documentos@plano.com.br");
  document.getElementById(`msg-${canal}`).value = texto;
}

function enviar(e) {
  e.preventDefault();
  alert("Mensagens enviadas!");
  showTab('contacts');
}

renderContacts();
showTab('contacts');
