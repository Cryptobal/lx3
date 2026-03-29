(function () {
  "use strict";

  var ENDPOINT = "/api/growth-os/tracking/event";
  var COOKIE_NAME = "lx3_visitor_id";
  var COOKIE_DAYS = 365;

  function generateId() {
    var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    var id = "";
    for (var i = 0; i < 20; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return "v_" + Date.now().toString(36) + "_" + id;
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      name +
      "=" +
      value +
      ";expires=" +
      d.toUTCString() +
      ";path=/;SameSite=Lax";
  }

  function getUTMParams() {
    var params = {};
    var search = window.location.search;
    var utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    utmKeys.forEach(function (key) {
      var match = search.match(new RegExp("[?&]" + key + "=([^&]*)"));
      if (match) params[key] = decodeURIComponent(match[1]);
    });
    return params;
  }

  function getDeviceType() {
    var w = window.innerWidth;
    if (w < 768) return "mobile";
    if (w < 1024) return "tablet";
    return "desktop";
  }

  // Get or create visitor ID
  var visitorId = getCookie(COOKIE_NAME);
  if (!visitorId) {
    visitorId = generateId();
    setCookie(COOKIE_NAME, visitorId, COOKIE_DAYS);
  }

  var pageEntryTime = Date.now();
  var maxScrollDepth = 0;
  var sessionPageViewId = null;

  // Track scroll depth
  function onScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      var depth = Math.round((scrollTop / docHeight) * 100);
      if (depth > maxScrollDepth) maxScrollDepth = depth;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Send page view
  var utm = getUTMParams();
  var payload = {
    type: "pageview",
    visitorId: visitorId,
    path: window.location.pathname,
    title: document.title,
    referrer: document.referrer || null,
    utmSource: utm.utm_source || null,
    utmMedium: utm.utm_medium || null,
    utmCampaign: utm.utm_campaign || null,
    utmTerm: utm.utm_term || null,
    utmContent: utm.utm_content || null,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    deviceType: getDeviceType(),
  };

  try {
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (data && data.pageViewId) {
          sessionPageViewId = data.pageViewId;
        }
      })
      .catch(function () {});
  } catch (e) {
    // Silent fail
  }

  // Send engagement data on page unload
  function sendEngagement() {
    var duration = Math.round((Date.now() - pageEntryTime) / 1000);
    if (duration < 1) return;

    var data = JSON.stringify({
      type: "engagement",
      visitorId: visitorId,
      pageViewId: sessionPageViewId,
      duration: duration,
      scrollDepth: maxScrollDepth,
      path: window.location.pathname,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([data], { type: "application/json" }));
    } else {
      try {
        fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
          keepalive: true,
        });
      } catch (e) {
        // Silent fail
      }
    }
  }

  window.addEventListener("beforeunload", sendEngagement);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") sendEngagement();
  });

  // Expose visitorId for forms
  window.__lx3 = { visitorId: visitorId };
})();
