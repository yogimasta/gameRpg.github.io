const shopItems = [
    { id: 1, name: "Iron sword", tipo: "arma", nivel: 1, efecto: { strength: 5 }, price: 100 },
    { id: 2, name: "Steel sword", tipo: "arma", nivel: 2, efecto: { strength: 10 }, price: 200 },
    { id: 3, name: "Fire sword", tipo: "arma", nivel: 3, efecto: { strength: 20 }, price: 300 },
    { id: 4, name: "Wodeen shield", tipo: "escudo", nivel: 1, efecto: { maxLife: 10 }, price: 50 },
    { id: 5, name: "Iron shield", tipo: "escudo", nivel: 2, efecto: { maxLife: 20 }, price: 100 },
    { id: 6, name: "Steel shield", tipo: "escudo", nivel: 3, efecto: { maxLife: 30 }, price: 150 }
    ];
    
    // Mostrar la tienda
    function openShop() {
    const shopElement = document.getElementById('shop');
    const shopItemsElement = document.getElementById('shop-items');
    shopItemsElement.innerHTML = '';
    
    shopItems.forEach(item => {
    const itemElement = document.createElement('li');
    itemElement.textContent = `${item.name} - ${item.price} oro`;
    const buyButton = document.createElement('button');
    buyButton.textContent = 'Comprar';
    buyButton.onclick = () => buyItem(item.id);
    itemElement.appendChild(buyButton);
    shopItemsElement.appendChild(itemElement);
    });
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('coins').style.display = 'block';
    shopElement.style.display = 'block';
    }
    
    // Cerrar la tienda
    function closeShop() {
    document.getElementById('shop').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    }
    
    
    function updateInventoryDisplay() {
    const inventoryDisplay = document.getElementById('inventory-display');
    if (inventoryDisplay) {
    inventoryDisplay.innerHTML = ''; 
    
    // Verifica si player.inventory es un array antes de usar forEach
    if (Array.isArray(player.inventory)) {
        player.inventory.forEach(item => {
            const itemElement = document.createElement('li');
            itemElement.textContent = item.name;
            inventoryDisplay.appendChild(itemElement);
        });
    } else {
        console.error("player.inventory no es un array o está definido como undefined.");
    }
    } else {
    console.error("No se encontró el elemento con id 'inventory-display'.");
    }
    }
    
    function aplicarEfectoObjeto(objeto, jugador) {
    for (let stat in objeto.efecto) {
    if (jugador.hasOwnProperty(stat)) {
        jugador[stat] += objeto.efecto[stat];
        if (stat === 'maxLife' && jugador.life > jugador.maxLife) {
            jugador.life = jugador.maxLife;
        }
    }
    }
    }
    function equiparObjeto(objeto, jugador) {
    if (objeto.tipo === "arma") {
    jugador.equipped.espada = objeto;
    } else if (objeto.tipo === "escudo") {
    jugador.equipped.escudo = objeto;
    }
    aplicarEfectoObjeto(objeto, jugador);
    }
    function buyItem(itemId) {
    // Encuentra el artículo correspondiente en la tienda
    const item = shopItems.find(i => i.id === itemId);
    
    if (!item) {
    console.error('Artículo no encontrado.');
    return;
    }
    
    // Actualiza las monedas del jugador y el inventario
    player.coins -= item.price;
    if (!player.inventory) {
    player.inventory = [];
    }
    player.inventory.push(item);
    
    // Equipar automáticamente si el artículo es de mayor nivel
    if (item.tipo === "arma" && (!player.equipped.espada || player.equipped.espada.nivel < item.nivel)) {
    equiparObjeto(item, player);
    } else if (item.tipo === "escudo" && (!player.equipped.escudo || player.equipped.escudo.nivel < item.nivel)) {
    equiparObjeto(item, player);
    } 
    
    // Actualiza la interfaz de usuario y guarda el estado del juego
    updateInventoryDisplay(); 
    updateStats(); 
    saveGame();
    }

    function sellTreasures() {
        let totalValue = 0;
        player.treasures.forEach(treasure => {
            totalValue += treasure.value;
        });
        player.coins += totalValue;
        player.treasures = [];
        updateStory(`You sold all your treasures for ${totalValue} coins.`);
        updateStats();
        saveGame();
    }