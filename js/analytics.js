function loadSegment() {
  const writeKey = window.APP_CONFIG?.segment?.writeKey;
  if (!writeKey || writeKey === "YOUR_SEGMENT_WRITE_KEY") {
    console.warn("[Segment] Replace YOUR_SEGMENT_WRITE_KEY in js/config.js");
    window.analytics = {
      track: (...args) => console.log("[Segment stub] track", ...args),
      identify: (...args) => console.log("[Segment stub] identify", ...args),
      page: (...args) => console.log("[Segment stub] page", ...args),
    };
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://cdn.segment.com/analytics.js/v1/${writeKey}/analytics.min.js`;
  document.head.appendChild(script);

  window.analytics = window.analytics || [];
  window.analytics.methods = [
    "trackSubmit",
    "trackClick",
    "trackLink",
    "trackForm",
    "pageview",
    "identify",
    "reset",
    "group",
    "track",
    "ready",
    "alias",
    "debug",
    "page",
    "once",
    "off",
    "on",
    "addSourceMiddleware",
    "addIntegrationMiddleware",
    "setAnonymousId",
    "addDestinationMiddleware",
  ];
  window.analytics.factory = function (method) {
    return function () {
      const args = Array.prototype.slice.call(arguments);
      args.unshift(method);
      window.analytics.push(args);
      return window.analytics;
    };
  };
  for (let i = 0; i < window.analytics.methods.length; i++) {
    const key = window.analytics.methods[i];
    window.analytics[key] = window.analytics.factory(key);
  }
}

function trackOrderCompleted(order) {
  const products = order.items.map((item) => ({
    product_id: item.productId,
    sku: item.productId,
    name: item.name,
    category: item.category,
    price: item.price,
    quantity: item.quantity,
  }));

  if (window.analytics?.track) {
    window.analytics.track("Order Completed", {
      order_id: order.orderId,
      total: order.total,
      revenue: order.total,
      currency: "USD",
      products,
    });
  }
}

loadSegment();

window.trackOrderCompleted = trackOrderCompleted;
