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
    
