let dungeons = [
    { name: "Dark Cave", description: "A spooky cave filled with unknown dangers.", level: 1, enemyTypes: [
        { type: 'Goblin', baseLife: 10, lifeMultiplier: 1.2 },
        { type: 'Bat', baseLife: 8, lifeMultiplier: 1.1 }
    ]},
    { name: "Abandoned Castle", description: "An old castle with hidden treasures and lurking ghosts.", level: 2, enemyTypes: [
        { type: 'Ghost', baseLife: 10, lifeMultiplier: 1.2 },
        { type: 'banshee', baseLife: 15, lifeMultiplier: 1.3 },
        { type: 'Wandering Soul', baseLife: 20, lifeMultiplier: 1.4 }
    ]},
    { name: "Haunted Forest", description: "A dense forest haunted by restless spirits and strange creatures.", level: 3, enemyTypes: [
        { type: 'Skeleton', baseLife: 15, lifeMultiplier: 1.3 },
        { type: 'Forest Spirit', baseLife: 20, lifeMultiplier: 1.4 },
        { type: 'Will-o\'-the-Wisp', baseLife: 12, lifeMultiplier: 1.5 }
    ]},
    { name: "Ancient Ruins", description: "Ruins of a forgotten civilization, rumored to contain powerful relics.", level: 4, enemyTypes: [
        { type: 'Ancient Guardian', baseLife: 25, lifeMultiplier: 1.6 },
        { type: 'Stone Golem', baseLife: 30, lifeMultiplier: 1.7 }
    ]},
    { name: "Mysterious Crypt", description: "A crypt filled with ancient undead and guarded by powerful curses.", level: 5, enemyTypes: [
        { type: 'Undead Knight', baseLife: 35, lifeMultiplier: 1.8 },
        { type: 'Lich', baseLife: 40, lifeMultiplier: 1.9 },
        { type: 'Mummy', baseLife: 30, lifeMultiplier: 1.8 }
    ]},
    { name: "Forgotten Temple", description: "A long-lost temple, said to be home to legendary artifacts and formidable guardians.", level: 6, enemyTypes: [
        { type: 'Temple Guardian', baseLife: 45, lifeMultiplier: 2.0 },
        { type: 'Serpent Demon', baseLife: 50, lifeMultiplier: 2.1 },
        { type: 'Ancient Elemental', baseLife: 55, lifeMultiplier: 2.2 }
    ]}
];

function fight() {
    if (player.life <= 0) {
    showDeathScreen("You are dead and cannot fight.");
    return;
    }
    
    let staminaCost = Math.floor(Math.random() * 9) + 2;
    if (player.stamina < staminaCost) {
    updateStory("You are too tired to fight. Rest to recover stamina.");
    return;
    }
    
    player.stamina -= staminaCost;
    
    // Daño infligido al jugador por el enemigo
    let damage = Math.floor(Math.random() * 20) + 10; // Daño de mi pj
    player.life -= damage;
    
    // Verifica si el jugador ha muerto
    if (player.life <= 0) {
    player.life = 0;
    updateStory("You fought bravely but were defeated. Rest to recover.");
    checkDeath("life");
    } else {
    let xpGained = Math.floor(Math.random() * 50) + 30;
    let coinsGained = Math.floor(Math.random() * 20) + 5;
    updateStory(`You fought an enemy and took ${damage} damage but gained ${xpGained} XP and ${coinsGained} coins.`);
    gainXP(xpGained);
    player.coins += coinsGained;
    }
    
    updateStats(); 
    updateHealthBar();
    saveGame(); 
    }
    let currentDungeonLevel = 1; // Siempre comenzamos en el nivel 1

function startDungeon() {
    const selectedDungeon = dungeons.find(d => d.level === currentDungeonLevel);

    if (!selectedDungeon) {
        updateStory("Dungeon not found.");
        return;
    }

    player.currentDungeon = {
        name: selectedDungeon.name,
        description: selectedDungeon.description,
        level: selectedDungeon.level,
        enemies: generateEnemies(selectedDungeon.level, selectedDungeon.enemyTypes), 
        boss: generateBoss(selectedDungeon.name) 
    };

    player.enemiesToDefeat = player.currentDungeon.enemies.length + 1; 
    player.enemiesDefeated = 0;

    updateStory(`You have entered the ${selectedDungeon.name}.`);
    return selectedDungeon;
}

function checkBossDefeat() {
    if (player.currentDungeon && player.currentDungeon.boss.life <= 0) {
        if (currentDungeonLevel < 6) { // Usa currentDungeonLevel aquí
            let proceed = confirm(`You defeated the boss of Level ${player.currentDungeon.level}! Do you want to proceed to Level ${currentDungeonLevel + 1}?`);
            if (proceed) {
                currentDungeonLevel++; // Avanza al siguiente nivel
                startDungeon(); // Reinicia la dungeon con el nuevo nivel
            } else {
                updateStory(`You chose to stay at Level ${currentDungeonLevel}.`); // Usa currentDungeonLevel
            }
        } else {
            updateStory("Congratulations! You have cleared all the levels and defeated the final boss!");
        }
    }
}
    

    function generateEnemies(level, enemyTypes) {
        const enemies = [];
        
        // Asegúrate de que enemyTypes esté definido y no esté vacío
        if (!enemyTypes || enemyTypes.length === 0) {
            console.error("Enemy types are not defined or empty.");
            return enemies; // Devuelve un array vacío
        }
    
        const numberOfEnemies = Math.floor(Math.random() * 5) + 3;
    
        for (let i = 0; i < numberOfEnemies; i++) {
            const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    
            const enemy = {
                name: `${randomType.type}`,
                level: level,
                life: Math.floor(Math.random() * 20) + randomType.baseLife + (level * randomType.lifeMultiplier)
            };
    
            enemies.push(enemy);
        }
    
        return enemies;
    }
    function generateBoss(dungeonLevel) {
        const dungeonBosses = [ 
            { dungeon: "Dark Cave", type: 'King Goblin', baseLife: 100, lifeMultiplier: 1.2 },
            { dungeon: "Abandoned Castle", type: 'Warden of Oblivion', baseLife: 110, lifeMultiplier: 1.3 },
            { dungeon: "Haunted Forest", type: 'King Elf', baseLife: 120, lifeMultiplier: 1.4 },
            { dungeon: "Ancient Ruins", type: 'Titan', baseLife: 130, lifeMultiplier: 1.5 },
            { dungeon: "Mysterious Crypt", type: 'King Zombie', baseLife: 140, lifeMultiplier: 1.6 },
            { dungeon: "Forgotten Temple", type: 'Bill Clave', baseLife: 150, lifeMultiplier: 1.7 }
        ];
    
        // Filtrar el boss basado en el nivel del dungeon
        const selectedBoss = dungeonBosses.find(boss => boss.dungeon.toLowerCase() === dungeonLevel.toLowerCase());
    
        if (!selectedBoss) {
            throw new Error(`No boss found for dungeon level: ${dungeonLevel}`);
        }
    
        const boss = {
            name: selectedBoss.type,
            level: dungeonLevel,
            life: Math.floor(Math.random() * 20) + selectedBoss.baseLife * selectedBoss.lifeMultiplier
        };
    
        return boss;
    }

let inBattle = false;

function fightDungeonEnemy() {
    if (!player.currentDungeon || player.enemiesDefeated >= player.enemiesToDefeat) {
        updateStory("No enemies left to fight.");
        inBattle = false;
        return;
    }

    inBattle = true;

    // Verifica que haya enemigos o un jefe disponible
    let currentEnemy = player.currentDungeon.enemies[0]; // Toma el primer enemigo

    if (!currentEnemy) {
        // Si no hay enemigos, toma el jefe
        currentEnemy = player.currentDungeon.boss;
    }

    if (!currentEnemy) {
        // Si no hay jefe, termina la función porque no hay nada para luchar
        updateStory("No enemies or boss to fight.");
        inBattle = false;
        return;
    }

    // El resto de tu código de batalla aquí
    let damage = Math.floor(Math.random() * 20) + 10;
    player.life -= damage;

    if (player.life < 0) player.life = 0;

    let baseDamage = Math.floor(Math.random() * 10) + 10;
    let strengthFactor = player.strength / 10;
    let enemyDamage = Math.floor(baseDamage * strengthFactor);
    currentEnemy.life -= enemyDamage;

    if (player.life <= 0) {
        updateStory("You were defeated by the enemy.");
        checkDeath("life");
        inBattle = false;
        return;
    }

    if (currentEnemy.life <= 0) {
        player.enemiesDefeated++;
        if (currentEnemy === player.currentDungeon.boss) {
            const reward = { coins: Math.floor(Math.random() * 100) + 50 };
            player.coins += reward.coins;
            updateStory(`
                <div class="dungeon-clear">You defeated the Dungeon Boss!</div>
                You have cleared the dungeon and earned 
                <span class="coins-earned">${reward.coins} coins</span>.
            `);
            checkBossDefeat();
            player.currentDungeon = null;
            inBattle = false;
        } else {
            updateStory(`
                <div class="stat-update">You defeated ${currentEnemy.name}.</div> 
                ${player.enemiesDefeated}/${player.enemiesToDefeat} enemies defeated.
            `);
            player.currentDungeon.enemies.shift(); // Elimina al enemigo derrotado
            inBattle = player.currentDungeon.enemies.length > 0 || player.currentDungeon.boss; // Continua la batalla si quedan enemigos o un jefe
        }
        gainXP(50);
    } else {
        const roundedLife = Math.round(currentEnemy.life);
        updateStory(`
            You fought ${currentEnemy.name} and dealt 
            <span class="enemy-life">${enemyDamage} damage</span> but took 
            <span class="player-life">${damage} damage</span>. 
            <span class="enemy-life">The enemy has ${roundedLife} hp left.</span>
        `);
    }

    updateStats();
    saveGame();
}


function useMagic(spell) {
    if (!player.currentDungeon) {
        updateStory("You are not in a dungeon to use magic.");
        return;
    }
    let manaCost;
    let damage;
    if (spell === "fireball") {
        manaCost = 20;
        damage = Math.floor(Math.random() * 35) + 25;
    } else if (spell === "shield") {
        manaCost = 10;
        damage = 0; // Shield doesn't deal damage but can be enhanced to reduce incoming damage
    } else {
        updateStory("Unknown spell. Available spells are 'fireball' and 'shield'.");
        return;
    }

    if (player.mana < manaCost) {
        updateStory("Not enough mana to cast the spell.");
        return;
    }
    player.mana -= manaCost;
    const currentEnemy = player.currentDungeon.enemies[0] || player.currentDungeon.boss;
    currentEnemy.life -= damage;

    if (currentEnemy.life <= 0) {
        player.enemiesDefeated++;
        if (currentEnemy === player.currentDungeon.boss) {
            const reward = { coins: Math.floor(Math.random() * 100) + 50 };
            player.coins += reward.coins;
            updateStory(`You defeated the Dungeon Boss with magic! You have cleared the dungeon and earned ${reward.coins} coins.`);
            player.currentDungeon = null;
        } else {
            updateStory(`You defeated ${currentEnemy.name} with a ${spell}. ${player.enemiesDefeated}/${player.enemiesToDefeat} enemies defeated.`);
        }
        gainXP(50);
    } else {
        updateStory(`You used ${spell} and dealt ${damage} damage. The enemy has ${currentEnemy.life} life left.`);
    }
    updateStats();
    saveGame();
}
