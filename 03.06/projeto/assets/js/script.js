
// ============================================================
// DATA & STATE
// ============================================================
const POKEMON_LIST = [
  {id:1,name:'Bulbasaur'},{id:4,name:'Charmander'},{id:7,name:'Squirtle'},
  {id:25,name:'Pikachu'},{id:39,name:'Jigglypuff'},{id:52,name:'Meowth'},
  {id:54,name:'Psyduck'},{id:58,name:'Growlithe'},{id:63,name:'Abra'},
  {id:74,name:'Geodude'},{id:94,name:'Gengar'},{id:113,name:'Chansey'},
  {id:129,name:'Magikarp'},{id:130,name:'Gyarados'},{id:131,name:'Lapras'},
  {id:133,name:'Eevee'},{id:143,name:'Snorlax'},{id:147,name:'Dratini'},
  {id:149,name:'Dragonite'},{id:150,name:'Mewtwo'},{id:151,name:'Mew'},
  {id:152,name:'Chikorita'},{id:155,name:'Cyndaquil'},{id:158,name:'Totodile'},
  {id:175,name:'Togepi'},{id:196,name:'Espeon'},{id:197,name:'Umbreon'},
  {id:249,name:'Lugia'},{id:250,name:'Ho-Oh'},{id:252,name:'Treecko'},
  {id:255,name:'Torchic'},{id:258,name:'Mudkip'},{id:384,name:'Rayquaza'},
  {id:448,name:'Lucario'},{id:445,name:'Garchomp'},{id:249,name:'Lugia'},
];

const TYPE_COLORS = {
  normal:'#a8a878',fire:'#f08030',water:'#6890f0',electric:'#f8d030',
  grass:'#78c850',ice:'#98d8d8',fighting:'#c03028',poison:'#a040a0',
  ground:'#e0c068',flying:'#a890f0',psychic:'#f85888',bug:'#a8b820',
  rock:'#b8a038',ghost:'#705898',dragon:'#7038f8',dark:'#705848',
  steel:'#b8b8d0',fairy:'#ee99ac'
};

// Type effectiveness chart (simplified)
const TYPE_CHART = {
  fire:{grass:2,ice:2,bug:2,steel:2,water:0.5,fire:0.5,rock:0.5,dragon:0.5},
  water:{fire:2,ground:2,rock:2,grass:0.5,water:0.5,dragon:0.5},
  grass:{water:2,ground:2,rock:2,fire:0.5,grass:0.5,poison:0.5,flying:0.5,bug:0.5,dragon:0.5,steel:0.5},
  electric:{water:2,flying:2,grass:0.5,electric:0.5,dragon:0.5,ground:0},
  psychic:{fighting:2,poison:2,psychic:0.5,steel:0.5,dark:0},
  ice:{grass:2,ground:2,flying:2,dragon:2,fire:0.5,water:0.5,ice:0.5,steel:0.5},
  dragon:{dragon:2,steel:0.5,fairy:0},
  dark:{psychic:2,ghost:2,fighting:0.5,dark:0.5,fairy:0.5},
  fighting:{normal:2,ice:2,rock:2,dark:2,steel:2,poison:0.5,flying:0.5,psychic:0.5,bug:0.5,ghost:0,fairy:0.5},
  poison:{grass:2,fairy:2,poison:0.5,ground:0.5,rock:0.5,ghost:0.5,steel:0},
  ground:{fire:2,electric:2,poison:2,rock:2,steel:2,grass:0.5,bug:0.5,flying:0},
  flying:{grass:2,fighting:2,bug:2,electric:0.5,rock:0.5,steel:0.5},
  ghost:{psychic:2,ghost:2,normal:0,fighting:0,dark:0.5},
  bug:{grass:2,psychic:2,dark:2,fire:0.5,fighting:0.5,poison:0.5,flying:0.5,ghost:0.5,steel:0.5,fairy:0.5},
  rock:{fire:2,ice:2,flying:2,bug:2,fighting:0.5,ground:0.5,steel:0.5},
  steel:{ice:2,rock:2,fairy:2,fire:0.5,water:0.5,electric:0.5,steel:0.5},
  fairy:{fighting:2,dragon:2,dark:2,fire:0.5,poison:0.5,steel:0.5},
  normal:{rock:0.5,steel:0.5,ghost:0}
};

let playerData = null, enemyData = null;
let playerHP, enemyHP, playerMaxHP, enemyMaxHP;
let playerMoves = [], enemyMoves = [];
let battleActive = false;
let playerShiny = false, enemyShiny = false;
const LEVEL = 50;

// ============================================================
// INIT: Populate selects
// ============================================================
window.onload = () => {
  const sel1 = document.getElementById('player-select');
  const sel2 = document.getElementById('enemy-select');
  const unique = [...new Map(POKEMON_LIST.map(p=>[p.id,p])).values()];
  unique.forEach(p => {
    [sel1,sel2].forEach(s => {
      const o = new Option(p.name, p.id);
      s.add(o);
    });
  });
  // Default selection
  sel1.value = 25; // Pikachu
  sel2.value = 4;  // Charmander
  previewPokemon('player');
  previewPokemon('enemy');
  checkReady();
};

async function previewPokemon(side) {
  const selId = document.getElementById(`${side}-select`).value;
  const isShiny = document.getElementById(`${side}-shiny`).checked;
  const img = document.getElementById(`${side}-preview`);
  if (!selId) { img.src=''; checkReady(); return; }
  const spriteType = isShiny ? 'front_shiny' : 'front_default';
  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${isShiny?'shiny/':''}${selId}.png`;
  img.className = 'preview-sprite' + (isShiny?' shiny':'');
  checkReady();
}

function checkReady() {
  const p = document.getElementById('player-select').value;
  const e = document.getElementById('enemy-select').value;
  document.getElementById('start-btn').disabled = !(p && e);
}

// ============================================================
// START BATTLE
// ============================================================
async function startBattle() {
  const pId = document.getElementById('player-select').value;
  const eId = document.getElementById('enemy-select').value;
  playerShiny = document.getElementById('player-shiny').checked;
  enemyShiny = document.getElementById('enemy-shiny').checked;

  document.getElementById('title-screen').style.display = 'none';
  document.getElementById('loading').style.display = 'block';

  try {
    [playerData, enemyData] = await Promise.all([
      fetchPokemon(pId), fetchPokemon(eId)
    ]);
    setupBattle();
  } catch(e) {
    alert('Erro ao carregar Pokémon. Verifique a conexão.');
    document.getElementById('title-screen').style.display = 'block';
    document.getElementById('loading').style.display = 'none';
  }
}

async function fetchPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error('API error');
  return await res.json();
}

// ============================================================
// SETUP BATTLE
// ============================================================
function setupBattle() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('battle-screen').style.display = 'block';
  battleActive = true;

  // HP calc (simplified Gen formula with base stats)
  playerMaxHP = Math.floor(((2 * playerData.stats[0].base_stat + 31) * LEVEL / 100) + LEVEL + 10);
  enemyMaxHP  = Math.floor(((2 * enemyData.stats[0].base_stat + 31) * LEVEL / 100) + LEVEL + 10);
  playerHP = playerMaxHP;
  enemyHP  = enemyMaxHP;

  // Names
  const pName = capitalize(playerData.name);
  const eName = capitalize(enemyData.name);
  document.getElementById('player-name').textContent = pName;
  document.getElementById('enemy-name').textContent = eName;
  document.getElementById('dialog-player-name').textContent = pName;
  document.getElementById('player-level').textContent = `Lv.${LEVEL}`;
  document.getElementById('enemy-level').textContent  = `Lv.${LEVEL}`;

  // HP numbers
  document.getElementById('player-hp-numbers').textContent = `${playerHP} / ${playerMaxHP}`;

  // Types
  setTypeBadges('player', playerData.types);
  setTypeBadges('enemy',  enemyData.types);

  // Tooltips (hover stats)
  setTooltip('player', playerData);
  setTooltip('enemy',  enemyData);

  // Sprites
  const pSprite = playerShiny
    ? playerData.sprites.front_shiny
    : playerData.sprites.front_default;
  const eSprite = enemyShiny
    ? enemyData.sprites.front_shiny
    : enemyData.sprites.front_default;

  const pImg = document.getElementById('player-sprite');
  const eImg = document.getElementById('enemy-sprite');
  pImg.src = pSprite;
  eImg.src = eSprite;
  pImg.className = 'sprite sprite-enter-player' + (playerShiny?' shiny':'');
  eImg.className = 'sprite sprite-enter-enemy' + (enemyShiny?' shiny':'');

  // Moves (up to 4)
  playerMoves = playerData.moves.slice(0,4).map(m => ({
    name: m.move.name,
    pp: 10
  }));
  enemyMoves = enemyData.moves.slice(0,4).map(m => m.move.name);

  // Build move buttons
  buildMoveButtons();

  // Update HP bars
  updateHPBar('player');
  updateHPBar('enemy');

  // Dialog
  setDialog(`Um ${eName} selvagem apareceu! O que ${pName} vai fazer?`);
}

function setTypeBadges(side, types) {
  types.forEach((t,i) => {
    const el = document.getElementById(`${side}-type${i+1}`);
    const typeName = t.type.name;
    el.textContent = typeName.toUpperCase();
    el.style.background = TYPE_COLORS[typeName] || '#888';
  });
}

function setTooltip(side, data) {
  const stats = data.stats;
  const lines = stats.map(s => `${formatStatName(s.stat.name)}: ${s.base_stat}`).join('\n');
  document.getElementById(`${side}-tooltip`).textContent = lines;
}

function formatStatName(name) {
  const map = {'hp':'HP','attack':'ATK','defense':'DEF','special-attack':'SpATK','special-defense':'SpDEF','speed':'SPE'};
  return map[name] || name;
}

function buildMoveButtons() {
  const grid = document.getElementById('moves-grid');
  grid.innerHTML = '';
  playerMoves.forEach((move, i) => {
    const btn = document.createElement('button');
    btn.className = 'move-btn';
    btn.id = `move-btn-${i}`;
    const moveName = capitalize(move.name.replace(/-/g,' '));
    btn.innerHTML = `${moveName}<span class="move-pp">PP: ${move.pp}</span>`;
    btn.onclick = () => playerAttack(i);
    grid.appendChild(btn);
  });
}

// ============================================================
// BATTLE LOGIC
// ============================================================
function showMoves() {
  // Already visible — just highlight
  setDialog(`Escolha um golpe!`);
}

async function playerAttack(moveIndex) {
  if (!battleActive) return;
  setButtonsEnabled(false);

  const move = playerMoves[moveIndex];
  if (move.pp <= 0) { setDialog('Sem PP! Escolha outro golpe.'); setButtonsEnabled(true); return; }

  move.pp--;
  document.getElementById(`move-btn-${moveIndex}`).querySelector('.move-pp').textContent = `PP: ${move.pp}`;

  const moveName = capitalize(move.name.replace(/-/g,' '));
  const pName = capitalize(playerData.name);
  const eName = capitalize(enemyData.name);

  // Player attacks
  animateAttack('player');
  await sleep(150);
  spawnProjectile(playerData.types[0].type.name);
  await sleep(350);
  animateHit('enemy');

  const dmg = calcDamage(playerData, enemyData, move.name);
  enemyHP = Math.max(0, enemyHP - dmg);

  const effectiveness = getEffectivenessMsg(playerData.types[0].type.name, enemyData.types);
  updateHPBar('enemy');

  let msg = `${pName} usou ${moveName}! `;
  if (effectiveness === 'super') msg += 'É super eficaz!';
  else if (effectiveness === 'not') msg += 'Não é muito eficaz...';
  else if (effectiveness === 'immune') msg += 'Não afeta ' + eName + '!';
  setDialog(msg);
  await sleep(1200);

  if (enemyHP <= 0) {
    await faintPokemon('enemy');
    return;
  }

  // Enemy attacks
  await sleep(400);
  const eMoveIdx = Math.floor(Math.random() * enemyMoves.length);
  const eMoveRaw = enemyMoves[eMoveIdx];
  const eMoveName = capitalize(eMoveRaw.replace(/-/g,' '));

  animateAttack('enemy');
  await sleep(150);
  spawnProjectile(enemyData.types[0].type.name, true);
  await sleep(350);
  animateHit('player');

  const eDmg = calcDamage(enemyData, playerData, eMoveRaw);
  playerHP = Math.max(0, playerHP - eDmg);
  updateHPBar('player');
  document.getElementById('player-hp-numbers').textContent = `${playerHP} / ${playerMaxHP}`;

  setDialog(`${eName} usou ${eMoveName}!`);
  await sleep(1200);

  if (playerHP <= 0) {
    await faintPokemon('player');
    return;
  }

  setDialog(`O que ${pName} vai fazer?`);
  setButtonsEnabled(true);
}

function calcDamage(attacker, defender, moveName) {
  const atk = attacker.stats[1].base_stat;
  const def = defender.stats[2].base_stat;
  const power = 60; // base power fallback
  const lvl = LEVEL;
  const base = Math.floor(((2*lvl/5+2) * power * atk/def) / 50) + 2;
  const variation = (Math.random() * 0.15 + 0.85);
  return Math.max(1, Math.floor(base * variation));
}

function getEffectivenessMsg(atkType, defTypes) {
  let eff = 1;
  defTypes.forEach(t => {
    const chart = TYPE_CHART[atkType] || {};
    const v = chart[t.type.name];
    if (v !== undefined) eff *= v;
  });
  if (eff === 0) return 'immune';
  if (eff >= 2) return 'super';
  if (eff < 1) return 'not';
  return 'normal';
}

function updateHPBar(side) {
  const hp    = side === 'player' ? playerHP : enemyHP;
  const maxHp = side === 'player' ? playerMaxHP : enemyMaxHP;
  const pct   = Math.max(0, hp / maxHp * 100);
  const bar   = document.getElementById(`${side}-hp-bar`);
  bar.style.width = pct + '%';
  bar.className = 'hp-bar-fill' + (pct <= 20 ? ' low' : pct <= 50 ? ' mid' : '');
}

async function faintPokemon(side) {
  battleActive = false;
  const sprite = document.getElementById(`${side}-sprite`);
  sprite.className = `sprite fainted-${side}`;
  const name = side === 'player' ? capitalize(playerData.name) : capitalize(enemyData.name);
  const other = side === 'player' ? capitalize(enemyData.name) : capitalize(playerData.name);
  setDialog(`${name} desmaiou!`);
  await sleep(900);
  document.getElementById('result-title').textContent  = side === 'enemy' ? '🏆 VITÓRIA!' : '💀 DERROTA!';
  document.getElementById('result-subtitle').textContent = side === 'enemy'
    ? `${capitalize(playerData.name)} venceu a batalha!`
    : `${capitalize(enemyData.name)} venceu a batalha!`;
  document.getElementById('result-overlay').classList.add('show');
}

function flee() {
  if (!battleActive) return;
  battleActive = false;
  setButtonsEnabled(false);
  setDialog(`${capitalize(playerData.name)} fugiu da batalha!`);
  setTimeout(() => {
    document.getElementById('result-title').textContent  = '🏃 FUGIU!';
    document.getElementById('result-subtitle').textContent = 'Tente novamente!';
    document.getElementById('result-overlay').classList.add('show');
  }, 1200);
}

// ============================================================
// ANIMATIONS
// ============================================================
function animateAttack(side) {
  const el = document.getElementById(`${side}-sprite`);
  el.classList.add('attacking');
  setTimeout(() => el.classList.remove('attacking'), 400);
}

function animateHit(side) {
  const el = document.getElementById(`${side}-sprite`);
  el.classList.add('hit');
  setTimeout(() => el.classList.remove('hit'), 400);
}

function spawnProjectile(type, reverse=false) {
  const bf = document.getElementById('battlefield');
  const proj = document.createElement('div');
  proj.className = 'projectile';
  proj.style.background = TYPE_COLORS[type] || '#fff';
  if (reverse) {
    proj.style.animation = 'none';
    proj.style.right = '25%';
    proj.style.left = 'auto';
    proj.style.transition = 'right 0.4s ease';
    setTimeout(() => proj.style.right = '65%', 10);
  }
  bf.appendChild(proj);
  setTimeout(() => proj.remove(), 500);
}

// ============================================================
// UI HELPERS
// ============================================================
function setDialog(text) {
  const el = document.getElementById('dialog-text');
  el.innerHTML = text + '<span class="cursor-blink">▼</span>';
}

function setButtonsEnabled(enabled) {
  document.querySelectorAll('.move-btn, .action-btn').forEach(b => {
    b.disabled = !enabled;
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function restartGame() {
  document.getElementById('result-overlay').classList.remove('show');
  document.getElementById('battle-screen').style.display = 'none';
  document.getElementById('title-screen').style.display = 'block';
  playerData = enemyData = null;
  battleActive = false;
}


