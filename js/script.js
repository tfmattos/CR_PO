let contacts = [
  {
    name: 'João da Silva',
    classification: 'Beneficiário',
    channels: ['whatsapp', 'email', 'app']
  },
  {
    name: 'Dra. Ana Costa',
    classification: 'Prestador',
    channels: ['whatsapp', 'email', 'portal']
  }
];

let history = [];
let selectedChannels = [];
let selectedContactIndex = null;

function renderContacts() {
  const contactList = document.getElementById('contact-list');
  contactList.innerHTML = `
    <section id="new-contact">
      <h3>+ Novo Contato</h3>
      <form onsubmit="addContact(event)">
        <input type="text" id="name" placeholder="Nome" required />
        <input type="text" id="classification" placeholder="Classificação" required />
        <div><label>Tipos de contato:</label></div>
        <div class="checkbox-group">
          <label><input type="checkbox" value="whatsapp" /> WhatsApp</label>
          <label><input type="checkbox" value="email" /> E-mail</label>
          <label><input type="checkbox" value="portal" /> Portal</label>
          <label><input type="checkbox" value="app" /> App Amil</label>
        </div>
        <button type="submit">Cadastrar</button>
      </form>
    </section>
  `;

  contacts.forEach((contact, index) => {
    const card = document.createElement('div');
    card.className = 'contact-card';
    card.innerHTML = `
      <h4>${contact.name}</h4>
      <div class="classification">${contact.classification}</div>
      <div class="icon-buttons">
        ${contact.channels.includes('whatsapp') ? `<i class="fa-brands fa-whatsapp" onclick="addChannel('whatsapp', ${index})"></i>` : ''}
        ${contact.channels.includes('email') ? `<i class="fa-solid fa-envelope" onclick="addChannel('email', ${index})"></i>` : ''}
        ${contact.channels.includes('portal') ? `<i class="fa-solid fa-network-wired" onclick="addChannel('portal', ${index})"></i>` : ''}
        ${contact.channels.includes('app') ? `<i class="fa-solid fa-mobile-alt" onclick="addChannel('app', ${index})"></i>` : ''}
      </div>
    `;
    contactList.appendChild(card);
  });
}

function addChannel(type, contactIndex) {
  if (selectedContactIndex !== contactIndex) {
    selectedChannels = [];
    selectedContactIndex = contactIndex;
    document.getElementById('form-container').innerHTML = `
      <h2>Mensagem para ${contacts[contactIndex].name}</h2>
      <form id="multiForm" onsubmit="sendAllMessages(event)">
        <div id="formFields"></div>
        <div id="channel-actions">
          <button type="submit">Enviar Todas</button>
          <button type="button" onclick="clearChannels()">Cancelar</button>
        </div>
      </form>
    `;
  }

  if (!selectedChannels.includes(type)) {
    selectedChannels.push(type);
    appendFormFields(type);
  }
}

function appendFormFields(type) {
  const formFields = document.getElementById('formFields');
  if (document.getElementById(`form-${type}`)) return;

  let html = `<div id="form-${type}"><h3>${type.toUpperCase()}</h3>`;
  if (type === 'whatsapp') {
    html += `
      <label>Número de telefone</label>
      <input type="tel" name="whatsapp_phone" required />
      <label>Mensagem</label>
      <textarea name="whatsapp_message" rows="3" required></textarea>
    `;
  } else if (type === 'email') {
    html += `
      <label>Assunto</label>
      <input type="text" name="email_subject" required />
      <label>Mensagem</label>
      <textarea name="email_message" rows="4" required></textarea>
    `;
  } else if (type === 'portal') {
    html += `
      <label>Título</label>
      <input type="text" name="portal_title" required />
      <label>Mensagem</label>
      <textarea name="portal_message" rows="4" required></textarea>
    `;
  } else if (type === 'app') {
    html += `
      <label>Título Push</label>
      <input type="text" name="app_title" required />
      <label>Mensagem</label>
      <textarea name="app_message" rows="3" required></textarea>
    `;
  }
  html += `</div>`;
  formFields.insertAdjacentHTML('beforeend', html);
}

function sendAllMessages(e) {
  e.preventDefault();
  const contact = contacts[selectedContactIndex];
  const data = new FormData(e.target);
  const timestamp = new Date().toLocaleString();

  selectedChannels.forEach(type => {
    let msg = '';
    if (type === 'whatsapp') msg = data.get('whatsapp_message');
    if (type === 'email') msg = data.get('email_message');
    if (type === 'portal') msg = data.get('portal_message');
    if (type === 'app') msg = data.get('app_message');

    history.push({
      contact: contact.name,
      type,
      message: msg,
      timestamp
    });
  });

  alert("Mensagens enviadas com sucesso!");
  clearChannels();
  renderHistory();
  showTab('history');
}

function clearChannels() {
  selectedChannels = [];
  selectedContactIndex = null;
  document.getElementById('form-container').innerHTML = '<p>Selecione um contato e um tipo de mensagem para começar.</p>';
}

function renderHistory() {
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = history.map(h => `
    <div class="contact-card">
      <h4>${h.contact} - ${h.type.toUpperCase()}</h4>
      <p>${h.message}</p>
      <small>${h.timestamp}</small>
    </div>
  `).join('');
}

function addContact(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const classification = document.getElementById('classification').value;
  const checkboxes = document.querySelectorAll('#new-contact input[type=checkbox]');
  const selected = Array.from(checkboxes).filter(c => c.checked).map(c => c.value);

  if (!name || !classification || selected.length === 0) {
    alert("Preencha todos os campos e selecione pelo menos um canal.");
    return;
  }

  contacts.push({ name, classification, channels: selected });
  renderContacts();
  e.target.reset();
}

function hideTabs() {
  document.getElementById('contact-list').style.display = 'none';
  document.getElementById('history-list').style.display = 'none';
}

function showTab(tabName) {
  hideTabs();
  clearChannels();

  if (tabName === 'contacts') {
    renderContacts();
    document.getElementById('contact-list').style.display = 'block';
  } else if (tabName === 'history') {
    renderHistory();
    document.getElementById('history-list').style.display = 'block';
  }
}

renderContacts();
showTab('contacts');
