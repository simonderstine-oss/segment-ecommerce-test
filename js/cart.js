const CART_KEY = "dummy-shop-cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function findProduct(productId) {
  return window.PRODUCTS.find((product) => product.id === productId);
}

function addToCart(productId, quantity = 1) {
  const product = findProduct(productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity,
    });
  }

  saveCart(cart);
  updateCartBadge();
}

function removeFromCart(productId) {
  saveCart(getCart().filter((item) => item.productId !== productId));
  updateCartBadge();
}

function clearCart() {
  saveCart([]);
  updateCartBadge();
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;

  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = String(count);
  badge.hidden = count === 0;
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function createOrderId() {
  return `ORD-${Date.now()}`;
}

window.getCart = getCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.getCartTotal = getCartTotal;
window.updateCartBadge = updateCartBadge;
window.formatMoney = formatMoney;
window.createOrderId = createOrderId;
