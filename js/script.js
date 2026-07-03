function go(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('visible'));
    document.getElementById(id).classList.add('visible');
    document.querySelectorAll('.top-nav a').forEach(a => a.classList.remove('active'));
    const navMap = { home: 'nav-home', catalog: 'nav-catalog', panelBuyer: 'nav-panelBuyer', panelSeller: 'nav-panelSeller' };
    if (navMap[id]) document.getElementById(navMap[id]).classList.add('active');
    window.scrollTo(0, 0);
}

function sellerTab(tab, btn) {
    document.querySelectorAll('.seller-tab').forEach(t => t.style.display = 'none');
    document.getElementById('seller-' + tab).style.display = 'block';
    document.querySelectorAll('#panelSeller .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

/* ---- PERFIL (dropdown) ---- */
function toggleProfileMenu(e) {
    e.stopPropagation();
    document.getElementById('profileDropdown').classList.toggle('open');
}
function closeProfileMenu() {
    document.getElementById('profileDropdown').classList.remove('open');
}
document.addEventListener('click', function (e) {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown.classList.contains('open') && !e.target.closest('.profile-menu')) {
        dropdown.classList.remove('open');
    }
});

/* ---- BUSCA / CATÁLOGO ---- */
const listings = [
    { title: "Boosting Valorant — Ouro → Platina", game: "valorant", gameLabel: "Valorant", type: "boosting", seller: "Bianca F.", rating: 4.9, reviews: 312, price: "89,90", deadline: "2 dias", img: "assets/valorant-rank.webp" },
    { title: "Boosting Valorant — Prata → Ouro", game: "valorant", gameLabel: "Valorant", type: "boosting", seller: "EloRush", rating: 4.6, reviews: 140, price: "54,90", deadline: "1 dia", img: "assets/valorant_icon.webp" },
    { title: "Boosting Valorant — Duo com coach", game: "valorant", gameLabel: "Valorant", type: "boosting", seller: "Bianca F.", rating: 4.9, reviews: 312, price: "120,00", deadline: "3 dias", img: "assets/valorant-rank.webp" },
    { title: "Conta LoL — Nível 150, 40 skins", game: "lol", gameLabel: "League of Legends", type: "conta", seller: "RiftTrader", rating: 4.7, reviews: 98, price: "340,00", deadline: "Entrega imediata", img: "assets/lol-account.jpg" },
    { title: "Coaching CS2 — 1h individual", game: "cs2", gameLabel: "CS2", type: "coaching", seller: "Bianca F.", rating: 5.0, reviews: 54, price: "60,00", deadline: "Agendado", img: "assets/CS2-Coaching.webp" },
    { title: "Boosting CS2 — Prata → Águia", game: "cs2", gameLabel: "CS2", type: "boosting", seller: "HeadshotPro", rating: 4.8, reviews: 201, price: "75,00", deadline: "2 dias", img: "assets/Cs2webp.webp" },
    { title: "Conta Genshin Impact — AR 55", game: "genshin", gameLabel: "Genshin Impact", type: "conta", seller: "TravelerShop", rating: 4.5, reviews: 63, price: "410,00", deadline: "Entrega imediata", img: "assets/genshin-impact.jpg" },
    { title: "Conta Roblox — Robux + itens raros", game: "roblox", gameLabel: "Roblox", type: "conta", seller: "BlockTrade", rating: 4.4, reviews: 87, price: "45,00", deadline: "Entrega imediata", img: "assets/roblox.webp" }
];

function performSearch(query) {
    document.getElementById('catalog-search').value = query || '';
    go('catalog');
    applyFilters();
}

function getChecked(filterName) {
    return Array.from(document.querySelectorAll('input[data-filter="' + filterName + '"]:checked')).map(el => el.value);
}

function clearFilters() {
    document.querySelectorAll('.filters input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.filters input[type="radio"]').forEach(rb => rb.checked = false);
    document.getElementById('catalog-search').value = '';
    applyFilters();
}

function applyFilters() {
    const query = document.getElementById('catalog-search').value.trim().toLowerCase();
    const games = getChecked('game');
    const types = getChecked('type');

    const filtered = listings.filter(item => {
        const matchesQuery = query === '' ||
            item.title.toLowerCase().includes(query) ||
            item.game.includes(query) ||
            item.gameLabel.toLowerCase().includes(query) ||
            item.seller.toLowerCase().includes(query);
        const matchesGame = games.length === 0 || games.includes(item.game);
        const matchesType = types.length === 0 || types.includes(item.type);
        return matchesQuery && matchesGame && matchesType;
    });

    renderResults(filtered, query);
}

function renderResults(items, query) {
    const grid = document.getElementById('catalog-results');
    const emptyState = document.getElementById('empty-state');
    const heading = document.getElementById('results-heading');

    heading.textContent = query
        ? items.length + ' resultado(s) para "' + query + '"'
        : items.length + ' resultados';

    if (items.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    grid.innerHTML = items.map(item => `
        <div class="listing-card" onclick="go('listing')">
            <div class="thumb"><img src="${item.img}" alt="${item.title}"></div>
            <h3>${item.title}</h3>
            <div class="seller">por ${item.seller} <span class="rating">★ ${item.rating.toFixed(1)} (${item.reviews})</span></div>
            <div class="price-row"><span class="price">R$ ${item.price}</span><span style="color:var(--text-dim); font-size:0.8rem;">${item.deadline}</span></div>
        </div>
    `).join('');
}

// Histórico de conversas por pedido. A chave é o título do pedido.
const chatHistory = {
    "Boosting Valorant Ouro→Platina": [
        { from: "seller", text: "Olá! Recebi seu pedido, vou iniciar o boosting ainda hoje. 🙂" },
        { from: "buyer", text: "Perfeito, obrigado! Pode ser à noite, depois das 20h." },
        { from: "seller", text: "Combinado, começo às 20h então." }
    ],
    "Coaching CS2 — 1h": [
        { from: "seller", text: "Sessão de coaching concluída! Qualquer dúvida sobre o feedback, me chama por aqui." }
    ],
    "Conta LoL Nível 150": [
        { from: "seller", text: "Conta entregue conforme combinado. Qualquer problema de acesso, me avise." }
    ]
};

let currentChatOrder = null;

function openChat(sellerName, orderTitle) {
    currentChatOrder = orderTitle;
    document.getElementById('chat-seller-name').textContent = sellerName;
    document.getElementById('chat-order-title').textContent = orderTitle;

    if (!chatHistory[orderTitle]) {
        chatHistory[orderTitle] = [];
    }

    renderChatMessages();
    go('chat');

    // Foca no campo de digitação para agilizar o envio
    setTimeout(() => {
        const input = document.getElementById('chat-input');
        if (input) input.focus();
    }, 50);
}

function renderChatMessages() {
    const container = document.getElementById('chat-messages');
    const messages = chatHistory[currentChatOrder] || [];

    if (messages.length === 0) {
        container.innerHTML = '<div class="chat-empty">Nenhuma mensagem ainda. Diga olá para o vendedor!</div>';
        return;
    }

    container.innerHTML = messages.map(msg => {
        const cls = msg.from === 'buyer' ? 'sent' : 'received';
        const instantClass = msg.instant ? ' instant-preview' : '';
        const badge = msg.instant ? '<span class="instant-badge">⚡ Entrega automática</span>' : '';
        return `<div class="chat-msg ${cls}${instantClass}">${badge}${escapeHtml(msg.text).replace(/\n/g, '<br>')}</div>`;
    }).join('');

    container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text || !currentChatOrder) return;

    chatHistory[currentChatOrder].push({ from: 'buyer', text: text });
    input.value = '';
    renderChatMessages();

    // Simula uma resposta simples do vendedor após um pequeno intervalo
    setTimeout(() => {
        chatHistory[currentChatOrder].push({ from: 'seller', text: 'Certo, obrigado pela mensagem! Já te retorno. 👍' });
        renderChatMessages();
    }, 900);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function toggleDeliveryMode(radio) {
    const isInstant = radio.value === 'instant';

    document.getElementById('mode-scheduled-label').classList.toggle('selected', !isInstant);
    document.getElementById('mode-instant-label').classList.toggle('selected', isInstant);

    document.getElementById('scheduled-deadline-field').style.display = isInstant ? 'none' : '';
    document.getElementById('instant-delivery-field').style.display = isInstant ? '' : 'none';
}

// Atualiza a pré-visualização da mensagem automática em tempo real
document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'instant-message-input') {
        const preview = document.getElementById('instant-preview-text');
        if (preview) {
            preview.textContent = e.target.value;
        }
    }
});

// Renderiza o catálogo completo assim que a página carrega
document.addEventListener('DOMContentLoaded', applyFilters);
