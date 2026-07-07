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

function loadImpact() {
  const campaignId = window.APP_CONFIG?.impact?.campaignId;
  if (!campaignId || campaignId === "YOUR_IMPACT_CAMPAIGN_ID") {
    console.warn("[Impact] Replace YOUR_IMPACT_CAMPAIGN_ID in js/config.js");
    window.ire = function (...args) {
      console.log("[Impact stub] ire", ...args);
    };
    return;
  }

  (function (a, b, c, d, e, f, g) {
    e.ire_o = c;
    e[c] =
      e[c] ||
      function () {
        (e[c].a = e[c].a || []).push(arguments);
      };
    f = d.createElement(b);
    g = d.getElementsByTagName(b)[0];
    f.async = 1;
    f.src = a;
    g.parentNode.insertBefore(f, g);
  })(
    "https://static.impact.com/static/js/impact.min.js",
    "script",
    "ire",
    document,
    window
  );

  window.ire("identify", {
    customerId: "",
    customerEmail: "",
  });
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

  const campaignId = window.APP_CONFIG?.impact?.campaignId;
  if (window.ire && campaignId && campaignId !== "YOUR_IMPACT_CAMPAIGN_ID") {
    window.ire("trackConversion", campaignId, {
      orderId: order.orderId,
      customerId: order.customerId,
      customerEmail: order.email,
      customerStatus: "NEW",
      currencyCode: "USD",
      orderPromoCode: "",
      orderDiscount: 0,
      items: order.items.map((item) => ({
        subTotal: item.price * item.quantity,
        category: item.category,
        sku: item.productId,
        quantity: item.quantity,
        name: item.name,
      })),
    });
  } else if (window.ire) {
    window.ire("trackConversion", "YOUR_IMPACT_CAMPAIGN_ID", {
      orderId: order.orderId,
      customerId: order.customerId,
      customerEmail: order.email,
      customerStatus: "NEW",
      currencyCode: "USD",
      items: order.items.map((item) => ({
        subTotal: item.price * item.quantity,
        category: item.category,
        sku: item.productId,
        quantity: item.quantity,
        name: item.name,
      })),
    });
  }
}

loadSegment();
loadImpact();

window.trackOrderCompleted = trackOrderCompleted;
