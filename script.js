let cart = [];

function renderMenu(category) {
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = '';
  MENU[category].forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <div class="emoji">${item.emoji}</div>
      <h4>${item.name}</h4>
      <p>${item.desc}</p>
      <div class="card-footer">
        <span class="price">$${item.price.toFixed(2)}</span>
        <button class="add-btn" data-id="${item.id}">Agregar</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.dataset.id, category));
  });
}

function addToCart(id, category) {
  const item = MENU[category].find(i => i.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCartUI();
  document.getElementById('openCart').classList.add('bump');
}

function updateCartUI() {
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');

  cartItems.innerHTML = '';
  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="color:#999; text-align:center; margin-top:30px;">Tu carrito está vacío</p>';
  }

  cart.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-info">
        <h5>${item.emoji} ${item.name}</h5>
        <span>$${item.price.toFixed(2)} c/u</span>
      </div>
      <div class="qty-controls">
        <button data-id="${item.id}" data-action="dec">-</button>
        <span>${item.qty}</span>
        <button data-id="${item.id}" data-action="inc">+</button>
      </div>
    `;
    cartItems.appendChild(row);
  });

  cartItems.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const item = cart.find(i => i.id === id);
      if (action === 'inc') item.qty += 1;
      if (action === 'dec') {
        item.qty -= 1;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
      }
      updateCartUI();
    });
  });

  cartCount.textContent = count;
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderMenu('tacos');

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMenu(btn.dataset.cat);
    });
  });

  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');

  document.getElementById('openCart').addEventListener('click', () => {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('active');
  });
  document.getElementById('closeCart').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('active');
  }

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío. Agrega productos antes de enviar tu pedido.');
      return;
    }
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const orderType = document.querySelector('input[name="orderType"]:checked').value;

    if (!name || !phone) {
      alert('Por favor ingresa tu nombre y teléfono.');
      return;
    }

    let message = `Hola, quiero hacer un pedido en *La Taquillera* 🌮%0A%0A`;
    message += `*Cliente:* ${name}%0A*Teléfono:* ${phone}%0A*Tipo:* ${orderType}%0A`;
    if (orderType === 'Entrega a domicilio') {
      message += `*Dirección:* ${address || 'Pendiente de confirmar'}%0A`;
    }
    message += `%0A*Pedido:*%0A`;
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.qty;
      message += `- ${item.qty}x ${item.name} ($${(item.price * item.qty).toFixed(2)})%0A`;
    });
    message += `%0A*Total: $${total.toFixed(2)}*`;

    const phoneNumber = '5218181111999';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  });

  const hamburger = document.getElementById('hamburger');
  hamburger.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('mobile-open');
  });
});
