let dungeons = [
    { name: "Dark Cave", description: "A spooky cave filled with unknown dangers.", level: 1, enemyTypes: [
        { type: 'Goblin', baseLife: 30, lifeMultiplier: 1.2, minDamage: 10, maxDamage: 20 },
        { type: 'Bat', baseLife: 40, lifeMultiplier: 1.1, minDamage: 15, maxDamage: 25 }
    ]},
    { name: "Abandoned Castle", description: "An old castle with hidden treasures and lurking ghosts.", level: 2, enemyTypes: [
        { type: 'Ghost', baseLife: 30, lifeMultiplier: 1.2, minDamage: 20, maxDamage: 30 },
        { type: 'Banshee', baseLife: 35, lifeMultiplier: 1.3, minDamage: 25, maxDamage: 35 },
        { type: 'Wandering Soul', baseLife: 45, lifeMultiplier: 1.4, minDamage: 30, maxDamage: 40 }
    ]},
    { name: "Haunted Forest", description: "A dense forest haunted by restless spirits and strange creatures.", level: 3, enemyTypes: [
        { type: 'Skeleton', baseLife: 40, lifeMultiplier: 1.3, minDamage: 25, maxDamage: 30 },
        { type: 'Forest Spirit', baseLife: 50, lifeMultiplier: 1.4, minDamage: 30, maxDamage: 35 },
        { type: 'Will-o\'-the-Wisp', baseLife: 55, lifeMultiplier: 1.5, minDamage: 30, maxDamage: 40 }
    ]},
    { name: "Ancient Ruins", description: "Ruins of a forgotten civilization, rumored to contain powerful relics.", level: 4, enemyTypes: [
        { type: 'Ancient Guardian', baseLife: 50, lifeMultiplier: 1.6, minDamage: 35, maxDamage: 40 },
        { type: 'Stone Golem', baseLife: 60, lifeMultiplier: 1.7, minDamage: 30, maxDamage: 50 }
    ]},
    { name: "Mysterious Crypt", description: "A crypt filled with ancient undead and guarded by powerful curses.", level: 5, enemyTypes: [
        { type: 'Undead Knight', baseLife: 55, lifeMultiplier: 1.8, minDamage: 40, maxDamage: 50 },
        { type: 'Lich', baseLife: 55, lifeMultiplier: 1.9, minDamage: 45, maxDamage: 50 },
        { type: 'Mummy', baseLife: 60, lifeMultiplier: 1.8, minDamage: 50, maxDamage: 60 }
    ]},
    { name: "Forgotten Temple", description: "A long-lost temple, said to be home to legendary artifacts and formidable guardians.", level: 6, enemyTypes: [
        { type: 'Temple Guardian', baseLife: 55, lifeMultiplier: 2.0, minDamage: 50, maxDamage: 65 },
        { type: 'Serpent Demon', baseLife: 60, lifeMultiplier: 2.1, minDamage: 50, maxDamage: 60 },
        { type: 'Ancient Elemental', baseLife: 60, lifeMultiplier: 2.2, minDamage: 55, maxDamage: 65 }
    ]},
    { name: "Infernus", description: "a place full of ancestral fire and demons that seek to devour you.", level: 7, enemyTypes: [
        { type: 'Demon', baseLife: 70, lifeMultiplier: 2.4, minDamage: 70, maxDamage: 75 },
        { type: 'Cerberus', baseLife: 80, lifeMultiplier: 2.3, minDamage: 70, maxDamage: 80 },
        { type: 'Sucubo', baseLife: 80, lifeMultiplier: 2.1, minDamage: 70, maxDamage: 80 }
    ]},
    { name: "City of heaven", description: "Is a majestic city in the clouds, where golden light shines eternally on structures of white marble and crystal. Guarded by ancient beings of light and shadow, only the worthy may enter and face its trials.", level: 8, enemyTypes: [
        { type: 'Potestad Guanda', baseLife: 105, lifeMultiplier: 2.0, minDamage: 80, maxDamage: 90 },
        { type: 'Ofanim Cosmo', baseLife: 110, lifeMultiplier: 2.1, minDamage: 90, maxDamage: 95 },
        { type: 'archangel gabriel', baseLife: 130, lifeMultiplier: 2.2, minDamage: 100, maxDamage: 120 }
    ]}
];

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
        if (currentDungeonLevel < 9) { // Usa currentDungeonLevel aquí
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
            { dungeon: "Dark Cave", type: 'King Goblin', baseLife: 90, lifeMultiplier: 1.2, minDamage: 40, maxDamage: 50 },
            { dungeon: "Abandoned Castle", type: 'Warden of Oblivion', baseLife: 120, lifeMultiplier: 1.3, minDamage: 45, maxDamage: 55 },
            { dungeon: "Haunted Forest", type: 'King Elf', baseLife: 150, lifeMultiplier: 1.4, minDamage: 50, maxDamage: 60 },
            { dungeon: "Ancient Ruins", type: 'Titan', baseLife: 250, lifeMultiplier: 1.5, minDamage: 60, maxDamage: 65 },
            { dungeon: "Mysterious Crypt", type: 'King Zombie', baseLife: 280, lifeMultiplier: 1.6, minDamage: 90, maxDamage: 100 },
            { dungeon: "Forgotten Temple", type: 'Bill Clave', baseLife: 300, lifeMultiplier: 1.7, minDamage: 105, maxDamage: 110 },
            { dungeon: "Infernus", type: 'Lucifer', baseLife: 350, lifeMultiplier: 1.7, minDamage: 150, maxDamage: 160 },
            { dungeon: "City of Heaven", type: 'God', baseLife: 500, lifeMultiplier: 2, minDamage: 160, maxDamage: 170 }
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

    // Costo de resistencia para luchar
    let staminaCost = Math.floor(Math.random() * 9) + 2;
    if (player.stamina < staminaCost) {
        updateStory("You are too tired to fight. Rest to recover stamina.");
        inBattle = false;
        return;
    }
    player.stamina -= staminaCost;

    // Daño infligido al jugador por el enemigo
    let damage = Math.floor(Math.random() * 20) + 10; // Daño del enemigo
    player.life -= damage;

    if (player.life <= 0) {
        player.life = 0;
        updateStory("You fought bravely but were defeated. Rest to recover.");
        checkDeath("life");
        inBattle = false;
        return;
    }

    // Daño infligido al enemigo por el jugador
    let baseDamage = Math.floor(Math.random() * 10) + 10;
    let strengthFactor = player.strength / 10;
    let enemyDamage = Math.floor(baseDamage * strengthFactor);
    currentEnemy.life -= enemyDamage;

    if (currentEnemy.life <= 0) {
        player.enemiesDefeated++;
        if (currentEnemy === player.currentDungeon.boss) {
            const reward = { coins: Math.floor(Math.random() * 100) + 100 };
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
        gainXP(100);
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
    updateHealthBar();
    saveGame();
}
