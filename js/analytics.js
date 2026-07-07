function trackOrderCompleted(order) {
  const products = order.items.map((item) => ({
    product_id: item.productId,
    sku: item.productId,
    name: item.name,
    category: item.category,
    price: item.price,
    quantity: item.quantity,
  }));

  analytics.track("Order Completed", {
    order_id: order.orderId,
    total: order.total,
    revenue: order.total,
    currency: "USD",
    products,
  });
}

window.trackOrderCompleted = trackOrderCompleted;
