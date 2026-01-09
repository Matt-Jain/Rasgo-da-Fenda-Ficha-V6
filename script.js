let characters = [];

/* LOGIN */
function fakeLogin() {
  if (!loginName.value) return alert("Digite um nome");
  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");
  showTab("create");
}

/* TABS */
function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  if (id === "dice") loadDice();
}

/* CRIAR */
function createCharacter() {
  if (!charName.value) return alert("Nome obrigatório");

  characters.push({
    name: charName.value,
    history: charHistory.value,
    race: null,
    life: 15, maxLife: 15,
    sanity: 15, maxSanity: 15,
    control: 0, maxControl: 20,
    aura: 0, maxAura: 0,
    points: 200,
    skills: {
      Luta:20, Pontaria:20, Investigação:20, Ocultismo:20,
      Percepção:20, Atletismo:20, Furtividade:20,
      Enganação:20, Intimidação:20, Tecnologia:20
    }
  });

  charName.value = "";
  charHistory.value = "";
  renderCharacters();
}

/* LISTAR */
function renderCharacters() {
  playerList.innerHTML = "";

  characters.forEach((c,i)=>{
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

/* DESPERTAR */
function awaken(i) {
  const roll = Math.floor(Math.random()*100)+1;
  let race, bonus, lifeBonus;

  if (roll >= 11) {
    race="Aureado";
    bonus={Percepção:15, Intuição:15, Resistência:10, Luta:10};
    lifeBonus=10;
  } else if (roll >= 2) {
    race="Vigilante";
    bonus={Luta:20, Ocultismo:20, Resistência:15, Intimidação:10};
    lifeBonus=15;
  } else {
    race="Nephilim";
    bonus={Luta:25, Intimidação:25, Ocultismo:20, Resistência:20};
    lifeBonus=20;
  }

  const c = characters[i];
  c.race = race;
  c.maxLife += lifeBonus;
  c.life += lifeBonus;
  c.maxAura = Math.floor(Math.random()*51)+50;
  c.aura = c.maxAura;

  Object.entries(bonus).forEach(([k,v])=>{
    if (!c.skills[k]) c.skills[k]=0;
    c.skills[k]+=v;
  });

  renderCharacters();
}

/* DADOS */
function loadDice() {
  diceCharacter.innerHTML = "";
  characters.forEach((c,i)=>{
    const o=document.createElement("option");
    o.value=i; o.textContent=c.name;
    diceCharacter.appendChild(o);
  });
  renderSkillsDice();
}

diceCharacter.onchange = renderSkillsDice;

function renderSkillsDice() {
  skillsDice.innerHTML = "";
  const c = characters[diceCharacter.value];
  if (!c) return;

  Object.entries(c.skills).forEach(([s,v])=>{
    const div=document.createElement("div");
    div.className="skill";
    div.textContent = `${s}: ${v}`;
    div.onclick=()=>rollDice(s,v);
    skillsDice.appendChild(div);
  });
}

/* ROLAGEM */
function rollDice(skill,value) {
  diceAnimation.classList.remove("hidden");
  diceResult.classList.add("hidden");

  setTimeout(()=>{
    diceAnimation.classList.add("hidden");
    const roll=Math.floor(Math.random()*100)+1;
    let text="Fracasso";
    if (roll<=value) text="Sucesso";

    diceResult.innerHTML = `<h3>${skill}</h3><p>Dado: ${roll}</p><strong>${text}</strong>`;
    diceResult.classList.remove("hidden");
  },800);
}
