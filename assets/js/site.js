/* Ahmed Amin portfolio: mobile nav, active section, scroll reveal, Tableau embed. No dependencies. */
(function () {
  "use strict";

  // ---------- Mobile nav ----------
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) setNav(false);
    });
    window.matchMedia("(min-width: 901px)").addEventListener("change", function (mq) {
      if (mq.matches) setNav(false);
    });
  }

  // ---------- Active section in nav (home page) ----------
  var sectionLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]'));
  if (sectionLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    sectionLinks.forEach(function (link) {
      var section = document.getElementById(link.getAttribute("href").slice(1));
      if (section) byId[section.id] = link;
    });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          sectionLinks.forEach(function (l) { l.removeAttribute("aria-current"); });
          var active = byId[entry.target.id];
          if (active) active.setAttribute("aria-current", "true");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    Object.keys(byId).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }

  // ---------- Scroll reveal ----------
  var reveals = document.querySelectorAll(".reveal");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduced) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  }

  // ---------- Click-to-load embeds ----------
  document.querySelectorAll("[data-embed]").forEach(function (button) {
    button.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = button.getAttribute("data-embed");
      iframe.title = button.getAttribute("data-embed-title") || "Embedded dashboard";
      iframe.loading = "lazy";
      iframe.allowFullscreen = true;
      button.replaceWith(iframe);
      iframe.focus();
    });
  });

  // ---------- Footer year ----------
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
