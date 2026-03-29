(function() {
  "use strict";

  var ENDPOINT = "/api/growth-os/tracking/event";
  var COOKIE_NAME = "lx3_visitor_id";
  var COOKIE_DAYS = 365;

  function getCookie(name) {
    var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toUTCString() + ";SameSite=Lax";
  }

  function generateId() {
    return "lx3_" + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  function getUTMParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source"),
      utmMedium: params.get("utm_medium"),
      utmCampaign: params.get("utm_campaign"),
      utmTerm: params.get("utm_term"),
      utmContent: params.get("utm_content")
    };
  }

  // Get or create visitor ID
  var visitorId = getCookie(COOKIE_NAME);
  if (!visitorId) {
    visitorId = generateId();
    setCookie(COOKIE_NAME, visitorId, COOKIE_DAYS);
  }

  // Make visitorId available globally for forms
  window.__lx3_visitor_id = visitorId;

  var startTime = Date.now();
  var maxScroll = 0;

  // Track scroll depth
  window.addEventListener("scroll", function() {
    var h = document.documentElement;
    var scrollPercent = Math.round((window.scrollY / (h.scrollHeight - h.clientHeight)) * 100);
    if (scrollPercent > maxScroll) maxScroll = scrollPercent;
  }, { passive: true });

  // Send page view
  var utm = getUTMParams();
  var payload = {
    visitorId: visitorId,
    path: window.location.pathname,
    title: document.title,
    referrer: document.referrer || null,
    utmSource: utm.utmSource,
    utmMedium: utm.utmMedium,
    utmCampaign: utm.utmCampaign,
    utmTerm: utm.utmTerm,
    utmContent: utm.utmContent,
    userAgent: navigator.userAgent,
    screenWidth: window.innerWidth
  };

  // Send initial page view
  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(function() {});

  // Send duration + scroll on page leave
  function sendExitData() {
    var duration = Math.round((Date.now() - startTime) / 1000);
    var exitPayload = {
      visitorId: visitorId,
      path: window.location.pathname,
      duration: duration,
      scrollDepth: maxScroll,
      type: "exit"
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, JSON.stringify(exitPayload));
    } else {
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exitPayload),
        keepalive: true
      }).catch(function() {});
    }
  }

  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden") sendExitData();
  });
})();
