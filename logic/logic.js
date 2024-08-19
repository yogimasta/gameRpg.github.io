let player = {};
let missions = [
    { name: "Defeat the Goblin", description: "A goblin is terrorizing the village. Defeat it to gain rewards.", completed: false },
    { name: "Find the Lost Ring", description: "Find the lost ring in the forest to help the old lady.", completed: false }
];


const storyElement = document.getElementById("story");
const statsElement = document.getElementById("stats");
const commandInput = document.getElementById("command-input");
const historyElement = document.getElementById("history");

function saveGame() {
    localStorage.setItem(player.username, JSON.stringify(player));
}

function loadGame(username) {
// Intenta obtener los datos del jugador del almacenamiento local
let savedPlayer = localStorage.getItem(username);

// Si hay datos guardados, los cargamos
if (savedPlayer) {
player = JSON.parse(savedPlayer);

// Asegúrate de que todos los campos necesarios están inicializados
if (!player.deathHistory) {
    player.deathHistory = [];
}

if (!Array.isArray(player.inventory)) {
    player.inventory = [];
}

// Si se requiere, inicializa otros campos necesarios aquí
if (!player.equipped) {
    player.equipped = {
        espada: null,
        escudo: null
    };
}

// Asegúrate de inicializar otros campos si es necesario
// ...

// Actualiza la interfaz de usuario
updateInventoryDisplay();
updateStats();

return true; // Datos cargados correctamente
}

// Si no hay datos guardados, devuelve false
return false;
}
// Llama a esta función al cargar la página o al iniciar sesión
function initializeGame(username) {
if (loadGame(username)) {
console.log('Juego cargado con éxito.');
} else {
console.log('No se encontraron datos guardados para el usuario.');
// Opcional: Configura el estado inicial del juego si no hay datos guardados
}
}

// Ejemplo de llamada al inicio
const username = 'nombreDeUsuario'; // Reemplaza con el nombre de usuario real
initializeGame(username);


function resetGame() {
    const savedDeathHistory = player.deathHistory;
    const savedUsername = player.username;
    const savedPassword = player.password;

    player = {
        username: savedUsername,
        password: savedPassword,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        life: 100,
        maxLife: 100,
        mana: 50,
        maxMana: 50,
        stamina: 50,
        maxStamina: 50,
        strength: 10,
        speed: 10,
        intelligence: 10,
        age: 15,
        maxAge: Math.floor(Math.random() * 50) + 50,
        remainingDays: null,
        remainingHours: 0,
        coins: 0,
        treasures: [],
        inventory: [],
        story: "Welcome to the world of adventures! Type 'help' to see available commands.",
        favorites: [],
        statusLevels: {
            strength: 1,
            speed: 1,
            intelligence: 1,
            stamina: 1,
            mana: 1
        },
        equipped: {
              espada: null,
              escudo: null
         },
        currentDungeon: null,
        enemiesDefeated: 0,
        enemiesToDefeat: 0,
        upgradingStatus: false,
        statusToUpgrade: null,
        coinsToSpend: null,
        deathHistory: savedDeathHistory,
        totalDaysPassed: 0 // Track the total number of days passed
    };

    player.remainingDays = calculateRemainingDays(player.maxAge, player.age);
    saveGame();
}

function calculateRemainingDays(maxAge, currentAge) {
    return Math.floor((maxAge - currentAge) * 365.25);
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        if (loadGame(username)) {
            if (player.password === password) {
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('game-container').style.display = 'block';
                document.getElementById('inventory').style.display = 'block';
                document.getElementById('coins').style.display = 'block';
                document.getElementById('player-name').innerText = player.username;
                updateStats();
                updateStory(player.story);
                startGameTimer();
            } else {
                alert('Incorrect password');
            }
        } else {
            alert('Username not found');
        }
    } else {
        alert('Please enter both username and password');
    }
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        if (!localStorage.getItem(username)) {
            player = {
                username: username,
                password: password,
            };
            resetGame();
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
            document.getElementById('player-name').innerText = player.username;
            updateStats();
            updateStory(player.story);
            startGameTimer();
        } else {
            alert('Username already exists');
        }
    } else {
        alert('Please enter both username and password');
    }
}

function logout() {
    saveGame();
    stopGameTimer();
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
}

function showDeleteContainer() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('delete-container').style.display = 'block';
}

function hideDeleteContainer() {
    document.getElementById('delete-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
}

function showHistory() {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('history-container').style.display = 'block';
    displayHistory();
}

function hideHistory() {
    document.getElementById('history-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
}

function deleteAccount() {
    const username = document.getElementById('delete-username').value;
    if (username) {
        if (localStorage.getItem(username)) {
            localStorage.removeItem(username);
            document.getElementById('status').innerText = `Account with username '${username}' has been deleted.`;
        } else {
            document.getElementById('status').innerText = `No account found with username '${username}'.`;
        }
    } else {
        document.getElementById('status').innerText = 'Please enter a username.';
    }
}

function toggleSection(sectionId) {
const content = document.getElementById(sectionId);
if (content.style.maxHeight) {
content.style.maxHeight = null;
} else {
content.style.maxHeight = content.scrollHeight + "px";
}
}

// Llama a esta función en tu código existente
function updateStats() {
document.getElementById('general').innerHTML = `
<div class="stat"><span class="stat-title">Level:</span> <span class="stat-value">${player.level}</span></div>
<div class="stat"><span class="stat-title">Stamina:</span> <span class="stat-value">${player.stamina}/${player.maxStamina}</span></div>
<div class="stat"><span class="stat-title">Age:</span> <span class="stat-value">${player.age}/${player.maxAge}</span></div>
<div class="stat"><span class="stat-title">Time Left:</span> <span class="stat-value">${player.remainingDays} days and ${player.remainingHours} hours</span></div>
`;
document.getElementById('achievements').innerHTML = `
<div class="stat"><span class="stat-title">Treasures:</span> <span class="stat-value">${player.treasures.length}</span></div>
<div class="stat"><span class="stat-title">Enemies Defeated:</span> <span class="stat-value">${player.enemiesDefeated}/${player.enemiesToDefeat}</span></div>
`;
document.getElementById('coins').innerHTML = `
<div class="coin-display">
<img src="https://images.vexels.com/media/users/3/266058/isolated/preview/1355772349a91d6fd6ea7ee29c9c5f50-icono-de-dinero-de-moneda-de-signo-de-da-lar.png" style="height: 53px; width: 53px;">
<span class="coins">${player.coins}</span>
</div>
`;
document.getElementById('strength').innerHTML = `
<div>
  <span style="color: white;">${player.strength}</span>
</div>
`;

document.getElementById('speed').innerHTML = `
<div>
  <span style="color: white;">${player.speed}</span>
</div>
`;

document.getElementById('intelligence').innerHTML = `
<div>
  <span style="color: white;">${player.intelligence}</span>
</div>
`;

updateHealthBar();
updateExpBar();
updateManaBar();
}

function updateStory(newStory) {
    player.story = newStory;
    storyElement.innerHTML = `<p>${player.story}</p>`;
}

function gainXP(amount) {
    player.xp += amount;
    if (player.xp >= player.xpToNextLevel) {
        player.xp -= player.xpToNextLevel;
        player.level++;
        player.xpToNextLevel = Math.floor(player.xpToNextLevel * 1.5);
        player.maxLife += 20;
        player.maxMana += 10;
        player.maxStamina += 10;
        player.strength++;
        player.speed++;
        player.intelligence++;
        player.life = player.maxLife;
        player.mana = player.maxMana;
        player.stamina = player.maxStamina;
        updateStory(`Congratulations! You leveled up to level ${player.level}.`);
    }
    updateStats();
    saveGame();
}

function checkDeath(reason) {
    if (player.life <= 0 || (player.remainingDays <= 0 && player.remainingHours <= 0)) {
        const deathDetails = {
            date: new Date().toLocaleString(),
            age: player.age,
            level: player.level,
            strength: player.strength,
            speed: player.speed,
            intelligence: player.intelligence,
            stamina: player.stamina,
            mana: player.mana,
            reason: reason,
            tip: getDeathTip(reason)
        };
        player.deathHistory.push(deathDetails);
        saveGame();
        showDeathScreen(deathDetails.tip);
        return true;
    }
    return false;
}

function getDeathTip(reason) {
    switch (reason) {
        case "life":
            return "Tip: Keep an eye on your life points. Use 'heal' or 'rest' to recover.";
        case "time":
            return "Tip: Manage your time wisely. Rest before you run out of hours.";
        default:
            return "Tip: Be careful with your actions.";
    }
}

function showDeathScreen(tip) {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('death-container').style.display = 'block';
    updateStory(`<span style="color:red;">You are dead!</span> ${tip}`);
    disableGameButtons();
}

function disableGameButtons() {
    document.getElementById('execute-button').style.display = 'none';
    document.querySelectorAll('.common-command').forEach(button => button.style.display = 'none');
}

function enableGameButtons() {
    document.getElementById('execute-button').style.display = 'inline-block';
    document.querySelectorAll('.common-command').forEach(button => button.style.display = 'inline-block');
}

function playAgain() {
    document.getElementById('death-container').style.display = 'none';
    resetGame();
    updateStats();
    updateStory(player.story);
    startGameTimer();
    enableGameButtons();
    document.getElementById('game-container').style.display = 'block';
    player.inventory = [];
    updateInventoryDisplay();
}









function explore() {
    if (player.life <= 0) {
        showDeathScreen("You are dead and cannot explore.");
        return;
    }
    let staminaCost = Math.floor(Math.random() * 9) + 2;
    if (player.stamina < staminaCost) {
        updateStory("You are too tired to explore. Rest to recover stamina.");
        return;
    }
    player.stamina -= staminaCost;
    player.remainingHours -= 1;
    if (player.remainingHours < 0) {
        player.remainingDays -= 1;
        player.remainingHours += 24;
    }
    let xpGained = Math.floor(Math.random() * 30) + 20;
    let encounter = Math.random();
    if (encounter < 0.1) {
        updateStory("You found a treasure chest!");
        player.treasures.push({ name: "Treasure Chest", value: Math.floor(Math.random() * 100) + 50 });
    } else if (encounter < 0.4) {
        const dungeon = startDungeon();
        updateStory(`You have found the ${dungeon.name}. ${dungeon.description} Type 'enter dungeon' to explore or 'continue exploring' to stay outside.`);
    } else if (encounter < 0.6) {
        updateStory("aca deberias encontrar un monstro pero no se como hacerlo a xD");
    } else {
        updateStory('You explore the surroundings and <span style="color: #ff0;;">gain some experience</span>.');
        gainXP(xpGained);
    }
    updateStats();
    saveGame();
    checkDeath("time");
}

function enterDungeon() {
    if (!player.currentDungeon) {
        updateStory("You are not near any dungeon.");
        return;
    }
    updateStory(`You entered the ${player.currentDungeon.name}. You have to defeat all enemies to exit.`);
    updateStats();
    saveGame();
}


function rest() {
    if (player.life <= 0) {
        showDeathScreen("You are dead and cannot rest.");
        return;
    }
    if (inBattle) {
updateStory("You cannot rest while in battle!");
return;
}
    player.life = player.maxLife;
    player.mana = player.maxMana;
    player.stamina = player.maxStamina;
    player.remainingHours -= 8;
    if (player.remainingHours < 0) {
        player.remainingDays -= 1;
        player.remainingHours += 24;
    }
    player.totalDaysPassed += 1;
    if (player.totalDaysPassed % 365 === 0) {
        player.age += 1;
        giveBirthdayGift();
    }
    updateStory("You take a rest and recover your strength.");
    updateStats();
    saveGame();
    checkDeath("time");
}

function giveBirthdayGift() {
    const coinsGift = Math.floor(Math.random() * 50) + 50;
    const treasureGift = { name: "Birthday Treasure", value: Math.floor(Math.random() * 100) + 50 };
    player.coins += coinsGift;
    player.treasures.push(treasureGift);
    updateStory(`Happy Birthday! You are now ${player.age} years old. You received ${coinsGift} coins and a ${treasureGift.name}.`);
}



function updateHealthBar() {
const healthBar = document.getElementById('health-bar');
const hpLabel = document.getElementById('hp-label');

const healthPercentage = (player.life / player.maxLife) * 100;


healthBar.style.width = `${healthPercentage}%`;
hpLabel.textContent = `HP: ${player.life}/${player.maxLife}`;
}


function increaseMaxLife(amount) {
player.maxLife += amount;
if (player.life > player.maxLife) {
player.life = player.maxLife; 
}
updateHealthBar(); 
}



function updateManaBar() {
const manaBar = document.getElementById('mana-bar');
const manaLabel = document.getElementById('mana-label');

const manaPercentage = (player.mana / player.maxMana) * 100;


manaBar.style.width = `${manaPercentage}%`;
manaLabel.textContent = `Mana: ${player.mana}/${player.maxMana}`;

}


function increaseMaxMana(amount) {
player.maxMana += amount;
if (player.mana > player.maxMana) {
player.mana = player.maxMana; 
}
updateManaBar(); 
}

function updateExpBar() {
const expBar = document.getElementById('exp-bar');
const expLabel = document.getElementById('exp-label');

const expPercentage = (player.xp / player.xpToNextLevel) * 100;


expBar.style.width = `${expPercentage}%`;

expLabel.textContent = `EXP: ${player.xp}/${player.xpToNextLevel}`;
}

function increaseMaxExp(amount) {
player.xpToNextLevel += amount;
if (player.xp > player.xpToNextLevel) {
player.xp = player.xpToNextLevel; 
}
updateExpBar(); 
}

function run() {
    if (player.life <= 0) {
        showDeathScreen("You are dead and cannot run.");
        return;
    }
    let staminaCost = Math.floor(Math.random() * 9) + 2;
    if (player.stamina < staminaCost) {
        updateStory("You are too tired to run. Rest to recover stamina.");
        return;
    }
    player.stamina -= staminaCost;
    updateStory("You successfully ran away from the danger.");
    updateStats();
    saveGame();
}

function heal() {
    if (player.life <= 0) {
        showDeathScreen("You are dead and cannot heal.");
        return;
    }
    let manaCost = 5;
    if (player.mana < manaCost) {
        updateStory("You don't have enough mana to heal.");
        return;
    }
    player.mana -= manaCost;
    player.life += 20;
    if (player.life > player.maxLife) {
        player.life = player.maxLife;
    }
    updateStory("You used your healing powers to recover some health.");
    updateStats();
    saveGame();
}

function meditate() {
    if (player.life <= 0) {
        showDeathScreen("You are dead and cannot meditate.");
        return;
    }
    let staminaCost = 10;
    if (player.stamina < staminaCost) {
        updateStory("You are too tired to meditate. Rest to recover stamina.");
        return;
    }
    player.stamina -= staminaCost;
    let manaGained = Math.floor(player.maxMana * 0.2);
    player.mana += manaGained;
    if (player.mana > player.maxMana) {
        player.mana = player.maxMana;
    }
    updateStory("You meditate to restore your mana.");
    updateStats();
    saveGame();
}

function upgradeStatus() {
    const options = `
        1 - Strength (Level: ${player.statusLevels.strength})
        2 - Speed (Level: ${player.statusLevels.speed})
        3 - Intelligence (Level: ${player.statusLevels.intelligence})
        4 - Stamina (Level: ${player.statusLevels.stamina})
        5 - Mana (Level: ${player.statusLevels.mana})
        Enter the number of the status you want to upgrade:
    `;
    updateStory(options);
    player.upgradingStatus = true;
}

function handleUpgrade(command) {
    if (player.upgradingStatus) {
        player.statusToUpgrade = parseInt(command);
        if (player.statusToUpgrade >= 1 && player.statusToUpgrade <= 5) {
            updateStory("Enter the number of coins you want to spend on this upgrade:");
            player.upgradingStatus = false;
            player.coinsToSpend = true;
        } else {
            updateStory("Invalid option. Please enter a valid status number.");
            player.upgradingStatus = false;
            player.statusToUpgrade = null;
        }
    } else if (player.coinsToSpend) {
        const coinsToSpend = parseInt(command);
        if (coinsToSpend > 0 && coinsToSpend <= player.coins) {
            player.coins -= coinsToSpend;
            switch (player.statusToUpgrade) {
                case 1:
                    player.strength += coinsToSpend;
                    player.statusLevels.strength += coinsToSpend;
                    updateStory(`You have upgraded your Strength by ${coinsToSpend} points.`);
                    break;
                case 2:
                    player.speed += coinsToSpend;
                    player.statusLevels.speed += coinsToSpend;
                    updateStory(`You have upgraded your Speed by ${coinsToSpend} points.`);
                    break;
                case 3:
                    player.intelligence += coinsToSpend;
                    player.statusLevels.intelligence += coinsToSpend;
                    updateStory(`You have upgraded your Intelligence by ${coinsToSpend} points.`);
                    break;
                case 4:
                    player.stamina += coinsToSpend;
                    player.statusLevels.stamina += coinsToSpend;
                    updateStory(`You have upgraded your Stamina by ${coinsToSpend} points.`);
                    break;
                case 5:
                    player.mana += coinsToSpend;
                    player.statusLevels.mana += coinsToSpend;
                    updateStory(`You have upgraded your Mana by ${coinsToSpend} points.`);
                    break;
                default:
                    updateStory("Invalid upgrade option.");
                    break;
            }
            player.coinsToSpend = false;
            player.statusToUpgrade = null;
            updateStats();
            saveGame();
        } else {
            updateStory("Invalid number of coins. Please enter a valid amount.");
        }
    }
}



function showHelp(command = null) {
    if (command) {
        const descriptions = {
            explore: "Explore: Gain experience and encounter random events. Costs stamina and 1 hour of game time.",
            rest: "Rest: Recover health, mana, and stamina. Ages you by 1 year.",
            fight: "Fight: Engage in combat, costs stamina and may reduce health. Gain experience and coins.",
            run: "Run: Escape from danger, costs stamina.",
            heal: "Heal: Use mana to recover health.",
            meditate: "Meditate: Recover mana, costs stamina.",
            upgrade: "Upgrade: Use coins to increase your status levels.",
            sell: "Sell: Sell all collected treasures for coins.",
            missions: "Missions: Show current missions.",
            favorite: "Favorite: Add a command to your list of favorites.",
            enter: "Enter: Enter a dungeon you have discovered.",
            fight: "Fight: Fight enemies in a dungeon.",
            magic: "Magic: Use spells in a dungeon (e.g., 'magic fireball').",
        };
        updateStory(descriptions[command] || "Command not found.");
    } else {
        updateStory("Available commands: explore, rest, fight, run, heal, meditate, upgrade, sell, missions, favorite, enter, fight, magic. Type 'help <command>' to see what each command does.");
    }
}






function showMissions() {
    let missionList = missions.map((mission, index) => {
        return `${index + 1}. ${mission.name} - ${mission.description} (Completed: ${mission.completed})`;
    }).join('<br>');
    updateStory(`Missions:<br>${missionList}`);
}






function addFavorite(command) {
    if (!player.favorites.includes(command)) {
        player.favorites.push(command);
        updateStory(`${command} has been added to your favorites.`);
    } else {
        updateStory(`${command} is already in your favorites.`);
    }
    saveGame();
}

function executeCommonCommand(command) {
    processCommand(command);
}

function processCommand(input = null) {
    const command = input || commandInput.value.toLowerCase();
    commandInput.value = "";
    if (player.upgradingStatus || player.coinsToSpend) {
        handleUpgrade(command);
        return;
    }
    if (command.startsWith('help ')) {
        showHelp(command.split(' ')[1]);
        return;
    }
    if (command === 'upgrade') {
        upgradeStatus();
        return;
    }
    if (command === 'enter dungeon') {
        enterDungeon();
        return;
    }
    if (command === 'fight') {
        fightDungeonEnemy();
        return;
    }
    if (command.startsWith('magic ')) {
        useMagic(command.split(' ')[1]);
        return;
    }
    switch (command) {
        case "explore":
            explore();
            break;
        case "rest":
            rest();
            break;
        case "fight":
            fight();
            break;
        case "run":
            run();
            break;
        case "heal":
            heal();
            break;
        case "meditate":
            meditate();
            break;
        case "missions":
            showMissions();
            break;
        case "sell":
            sellTreasures();
            break;
        case "favorite":
            addFavorite(command.split(' ')[1]);
            break;
        case "help":
            showHelp();
            break;
        case "shop":
            openShop()
        default:
            updateStory("Unknown command. Type 'help' to see available commands.");
    }
    checkDeath("time");
}

function displayHistory() {
    if (!player.deathHistory.length) {
        historyElement.innerHTML = "<p>No death history available.</p>";
        return;
    }
    let historyContent = player.deathHistory.map((death, index) => {
        return `
            <div>
                <h3>Death #${index + 1}</h3>
                <p>Date: ${death.date}</p>
                <p>Age: ${death.age}</p>
                <p>Level: ${death.level}</p>
                <p>Strength: ${death.strength}</p>
                <p>Speed: ${death.speed}</p>
                <p>Intelligence: ${death.intelligence}</p>
                <p>Stamina: ${death.stamina}</p>
                <p>Mana: ${death.mana}</p>
                <p>Reason: ${death.reason}</p>
                <p>Tip: ${death.tip}</p>
            </div>
        `;
    }).join('<hr>');
    historyElement.innerHTML = historyContent;
}

let gameTimer;
let staminaRecoveryTimer;

function startGameTimer() {
    gameTimer = setInterval(() => {
        player.remainingHours -= 1;
        if (player.remainingHours < 0) {
            player.remainingDays -= 1;
            player.remainingHours = 23;
        }
        updateStats();
        saveGame();
        checkDeath("time");
    }, 120000); // 2 minutes in milliseconds

    staminaRecoveryTimer = setInterval(() => {
        if (player.stamina < player.maxStamina) {
            player.stamina += 1;
            updateStats();
            saveGame();
        }
    }, 10000); // 10 seconds in milliseconds
}

function stopGameTimer() {
    clearInterval(gameTimer);
    clearInterval(staminaRecoveryTimer);
}

window.onload = function() {
    document.getElementById('login-container').style.display = 'block';
}
