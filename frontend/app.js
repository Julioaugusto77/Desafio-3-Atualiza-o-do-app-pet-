const BASE_URL = window.APP_BASE_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/api/entries`;
const PETS_API_URL = `${BASE_URL}/api/pets`;

// ── Elementos do Diário ──────────────────────────────────────────────────────
const form = document.getElementById('entry-form');
const entryId = document.getElementById('entry-id');
const title = document.getElementById('title');
const description = document.getElementById('description');
const happenedAt = document.getElementById('happenedAt');
const entriesList = document.getElementById('entries-list');
const message = document.getElementById('message');
const cancelEdit = document.getElementById('cancel-edit');
const formTitle = document.getElementById('form-title');
const reloadBtn = document.getElementById('reload-btn');

// ── Elementos de Pets ────────────────────────────────────────────────────────
const petForm = document.getElementById('pet-form');
const petId = document.getElementById('pet-id');
const petName = document.getElementById('pet-name');
const petSpecies = document.getElementById('pet-species');
const petBreed = document.getElementById('pet-breed');
const petAge = document.getElementById('pet-age');
const petsList = document.getElementById('pets-list');
const petMessage = document.getElementById('pet-message');
const petCancelEdit = document.getElementById('pet-cancel-edit');
const petFormTitle = document.getElementById('pet-form-title');
const petReloadBtn = document.getElementById('pet-reload-btn');

// ── Navegação por abas ───────────────────────────────────────────────────────
document.querySelectorAll('#main-tabs .nav-link').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#main-tabs .nav-link').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const tab = btn.dataset.tab;
    document.getElementById('section-diary').classList.toggle('hidden', tab !== 'diary');
    document.getElementById('section-pets').classList.toggle('hidden', tab !== 'pets');
  });
});

// ── Diário ───────────────────────────────────────────────────────────────────
function showMessage(text) {
  message.textContent = text;
}

function clearForm() {
  form.reset();
  entryId.value = '';
  formTitle.textContent = 'Novo registro';
  cancelEdit.classList.add('hidden');
  happenedAt.value = new Date().toISOString().slice(0, 16);
}

function formatDate(date) {
  return new Date(date).toLocaleString('pt-BR');
}

async function loadEntries() {
  const response = await fetch(API_URL);
  const entries = await response.json();

  if (!entries.length) {
    entriesList.innerHTML = '<p>Nenhum registro encontrado.</p>';
    return;
  }

  entriesList.innerHTML = entries.map(entry => `
    <div class="entry-item">
      <h3>${entry.title}</h3>
      <p>${formatDate(entry.happenedAt)}</p>
      <p>${entry.description}</p>
      <div class="entry-buttons">
        <button onclick="editEntry('${entry._id}')">Editar</button>
        <button onclick="deleteEntry('${entry._id}')">Excluir</button>
      </div>
    </div>
  `).join('');
}

async function saveEntry(data) {
  const id = entryId.value;
  const url = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

window.editEntry = async function (id) {
  const response = await fetch(`${API_URL}/${id}`);
  const entry = await response.json();

  entryId.value = entry._id;
  title.value = entry.title;
  description.value = entry.description;
  happenedAt.value = new Date(entry.happenedAt).toISOString().slice(0, 16);

  formTitle.textContent = 'Editar registro';
  cancelEdit.classList.remove('hidden');
  showMessage('Editando registro.');
};

window.deleteEntry = async function (id) {
  if (!confirm('Deseja excluir este registro?')) return;

  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  showMessage('Registro excluído.');
  loadEntries();
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    title: title.value,
    description: description.value,
    happenedAt: happenedAt.value
  };

  await saveEntry(data);
  showMessage(entryId.value ? 'Registro atualizado.' : 'Registro criado.');
  clearForm();
  loadEntries();
});

cancelEdit.addEventListener('click', () => {
  clearForm();
  showMessage('Edição cancelada.');
});

reloadBtn.addEventListener('click', loadEntries);

// ── Pets ─────────────────────────────────────────────────────────────────────
function showPetMessage(text) {
  petMessage.textContent = text;
}

function clearPetForm() {
  petForm.reset();
  petId.value = '';
  petFormTitle.textContent = 'Novo pet';
  petCancelEdit.classList.add('hidden');
}

async function loadPets() {
  const response = await fetch(PETS_API_URL);
  const pets = await response.json();

  if (!pets.length) {
    petsList.innerHTML = '<p>Nenhum pet cadastrado.</p>';
    return;
  }

  petsList.innerHTML = pets.map(pet => `
    <div class="entry-item">
      <h3>${pet.name}</h3>
      <p>
        <strong>Espécie:</strong> ${pet.species} &nbsp;|&nbsp;
        <strong>Raça:</strong> ${pet.breed} &nbsp;|&nbsp;
        <strong>Idade:</strong> ${pet.age} ano(s)
      </p>
      <div class="entry-buttons">
        <button onclick="editPet('${pet._id}')">Editar</button>
        <button onclick="deletePet('${pet._id}')">Excluir</button>
      </div>
    </div>
  `).join('');
}

async function savePet(data) {
  const id = petId.value;
  const url = id ? `${PETS_API_URL}/${id}` : PETS_API_URL;
  const method = id ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

window.editPet = async function (id) {
  const response = await fetch(`${PETS_API_URL}/${id}`);
  const pet = await response.json();

  petId.value = pet._id;
  petName.value = pet.name;
  petSpecies.value = pet.species;
  petBreed.value = pet.breed;
  petAge.value = pet.age;

  petFormTitle.textContent = 'Editar pet';
  petCancelEdit.classList.remove('hidden');
  showPetMessage('Editando pet.');
};

window.deletePet = async function (id) {
  if (!confirm('Deseja excluir este pet?')) return;

  await fetch(`${PETS_API_URL}/${id}`, { method: 'DELETE' });
  showPetMessage('Pet excluído.');
  loadPets();
};

petForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: petName.value,
    species: petSpecies.value,
    breed: petBreed.value,
    age: Number(petAge.value)
  };

  await savePet(data);
  showPetMessage(petId.value ? 'Pet atualizado.' : 'Pet cadastrado.');
  clearPetForm();
  loadPets();
});

petCancelEdit.addEventListener('click', () => {
  clearPetForm();
  showPetMessage('Edição cancelada.');
});

petReloadBtn.addEventListener('click', loadPets);

// ── PWA ───────────────────────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./service-worker.js');
      console.log('Service Worker registrado com sucesso.');
    } catch (error) {
      console.log('Erro ao registrar Service Worker:', error);
    }
  });
}

clearForm();
loadEntries();
loadPets();
