/* ELEMENTOS */
const loginScreen = document.getElementById("login-screen");
const app = document.getElementById("app");
const loginName = document.getElementById("loginName");

const charName = document.getElementById("charName");
const charHistory = document.getElementById("charHistory");
const playerList = document.getElementById("playerList");

const diceCharacter = document.getElementById("diceCharacter");
const skillsDice = document.getElementById("skillsDice");
const diceAnimation = document.getElementById("diceAnimation");
const diceResult = document.getElementById("diceResult");

/* DADOS */
let characters = [];

/* LOGIN */
function fakeLogin() {
  if (!loginName.value.trim()) {
    alert("Digite um nome para entrar");
    return;
  }

  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");
  showTab("create");
}

/* TABS */
function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => {
    t.classList.add("hidden");
  });

  document.getElementById(id).classList.remove("hidden");

  if (id === "dice") loadDice();
}

/* CRIAR PERSONAGEM */
function createCharacter() {
  if (!charName.value.trim()) {
    alert("Nome do personagem é obrigatório");
    return;
  }

  characters.push({
    name: charName.value,
    history: charHistory.value,
    race: null,

    life: 15,
    maxLife: 15,

    sanity: 15,
    maxSanity: 15,

    control: 0,
    maxControl: 20,

    aura: 0,
    maxAura: 0,

    skills: {
      Luta: 20,
      Pontaria: 20,
      Investigação: 20,
      Ocultismo: 20,
      Percepção: 20,
      Atletismo: 20,
      Furtividade: 20,
      Enganação: 20,
      Intimidação: 20,
      Tecnologia: 20
    }
  });

  charName.value = "";
  charHistory.value = "";

  renderCharacters();
}

/* LISTAR PERSONAGENS */
function renderCharacters() {
  playerList.innerHTML = "";

  characters.forEach((c, i) => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <strong>${c.name}</strong> ${c.race ? `(${c.race})` : ""}

      <div class="status">
        <div class="life">Vida ${c.life}/${c.maxLife}</div>
        <div class="sanity">San ${c.sanity}/${c.maxSanity}</div>
        <div class="control">Inc ${c.control}/${c.maxControl}</div>
        ${c.race ? `<div class="aura">Aura ${c.aura}/${c.maxAura}</div>` : ""}
      </div>

      ${!c.race ? `<button onclick="awaken(${i})">Despertar</button>` : ""}
    `;

    playerList.appendChild(div);
  });
}

/* DESPERTAR DAS RAÇAS */
function awaken(i) {
  const roll = Math.floor(Math.random() * 100) + 1;

  let race, bonus, lifeBonus;

  if (roll >= 11) {
    race = "Aureado";
    bonus = { Percepção: 15, Intuição: 15, Resistência: 10, Luta: 10 };
    lifeBonus = 10;
  } else if (roll >= 2) {
    race = "Vigilante";
    bonus = { Luta: 20, Ocultismo: 20, Resistência: 15, Intimidação: 10 };
    lifeBonus = 15;
  } else {
    race = "Nephilim";
    bonus = { Luta: 25, Intimidação: 25, Ocultismo: 20, Resistência: 20 };
    lifeBonus = 20;
  }

  const c = characters[i];
  c.race = race;

  c.maxLife += lifeBonus;
  c.life += lifeBonus;

  c.maxAura = Math.floor(Math.random() * 51) + 50;
  c.aura = c.maxAura;

  Object.entries(bonus).forEach(([k, v]) => {
    if (!c.skills[k]) c.skills[k] = 0;
    c.skills[k] += v;
  });

  renderCharacters();
}

/* DADOS */
function loadDice() {
  diceCharacter.innerHTML = "";

  characters.forEach((c, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = c.name;
    diceCharacter.appendChild(opt);
  });

  renderSkillsDice();
}

diceCharacter.addEventListener("change", renderSkillsDice);

function renderSkillsDice() {
  skillsDice.innerHTML = "";
  const c = characters[diceCharacter.value];
  if (!c) return;

  Object.entries(c.skills).forEach(([skill, value]) => {
    const div = document.createElement("div");
    div.className = "skill";
    div.textContent = `${skill}: ${value}`;
    div.onclick = () => rollDice(skill, value);
    skillsDice.appendChild(div);
  });
}

/* ROLAGEM */
function rollDice(skill, value) {
  diceAnimation.classList.remove("hidden");
  diceResult.classList.add("hidden");

  setTimeout(() => {
    diceAnimation.classList.add("hidden");

    const roll = Math.floor(Math.random() * 100) + 1;
    const result = roll <= value ? "Sucesso" : "Fracasso";

    diceResult.innerHTML = `
      <h3>${skill}</h3>
      <p>Dado: ${roll}</p>
      <strong>${result}</strong>
    `;

    diceResult.classList.remove("hidden");
  }, 800);
}
