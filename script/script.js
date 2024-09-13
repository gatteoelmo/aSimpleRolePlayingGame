let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "town square",
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\". <br> [A] Go to store. <br> [B] Go to cave. <br> [C] Fight dragon."
  },
  {
    name: "store",
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store. <br> [A] Buy 10 health (10 gold). <br> [B] Buy weapon (30 gold). <br> [C] Go to town square."
  },
  {
    name: "cave",
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters. <br> [A] Fight slime. <br> [B] Fight fanged beast. <br> [C] Go to town square."
  },
  {
    name: "fight",
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster. <br> [A] Attack! <br> [B] Dodge. <br> [C] Run."
  },
  {
    name: "kill monster",
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold. <br> [A] Go to town square. <br> [B] Go to town square. <br> [C] Go to town square.'
  },
  {
    name: "lose",
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620; <br> [A] REPLAY? <br> [B] REPLAY? <br> [C] REPLAY?"
  },
  { 
    name: "win", 
    "button functions": [restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389; <br> [A] REPLAY? <br> [B] REPLAY? <br> [C] REPLAY?" 
  },
  {
    name: "easter egg",
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win! <br> [A] 2. <br> [B] 8. <br> [C] Go to town square?"
  }
];

// initialize buttons
button1.onclick = goTown;
button2.onclick = goTown;
button3.onclick = goTown;

function update(location) {
  monsterStats.style.display = "none";
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold = gold - 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerHTML = "You do not have enough gold to buy health. <br>[C] Go to town square.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerHTML += " In your inventory you have: " + inventory + "<br> [A] Buy 10 health (10 gold). <br> [B] Buy weapon (30 gold). <br> [C] Go to town square.";
    } else {
      text.innerHTML = "You do not have enough gold to buy a weapon. <br> [A] Buy 10 health (10 gold). <br> [C] Go to town square.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    text.innerText += "[B] Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  text.innerText += "\n [A] Attack! \n [B] Dodge. \n [C] Run."
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name + "\n [A] Attack! \n [B] Dodge. \n [C] Run.";
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + ", ";
  }
  if (numbers.includes(guess)) {
    text.innerHTML += " Right! You win 20 gold! <br> [C] Go to town square"; ;
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerHTML += " Wrong! You lose 10 health! <br> [C] Go to town square";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}