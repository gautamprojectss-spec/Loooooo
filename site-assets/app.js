(() => {
  const body = document.body;
  const loader = document.querySelector("[data-site-loader]");
  const header = document.querySelector("[data-header]");
  const progress = document.querySelector("[data-scroll-progress]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navLinks = document.querySelectorAll(".nav-links a");
  const serviceDropdown = document.querySelector("[data-services-dropdown]");
  const serviceToggle = document.querySelector("[data-services-toggle]");
  const yearTargets = document.querySelectorAll("[data-year]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const desktopPointer = window.matchMedia("(min-width: 861px)").matches;
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");

  if (finePointer && desktopPointer && !reduceMotion && cursorDot && cursorRing) {
    body.classList.add("cursor-ready");
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const moveCursor = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      window.requestAnimationFrame(renderCursor);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.querySelectorAll("a, button, input, select, textarea, .service-card, .work-card, .card, .result-card, .process-card, .overview-card, .link-card, .blog-card, .faq-item, .image-placeholder, .image-frame, .client-card, .proof-quote, .case-preview, .team-role-grid article, .team-photo-placeholder, .brand-cloud span, .checkbox-field label, .contact-note").forEach((item) => {
      item.addEventListener("mouseenter", () => body.classList.add("cursor-hover"));
      item.addEventListener("mouseleave", () => body.classList.remove("cursor-hover"));
    });
    renderCursor();
  }

  const loaderCount = loader ? loader.querySelector("[data-loader-count]") : null;
  const loaderFill = loader ? loader.querySelector(".loader-line-fill") : null;

  function revealSite() {
    body.classList.remove("is-loading");
    body.classList.add("is-loaded");
    if (loader) {
      window.setTimeout(() => {
        loader.setAttribute("aria-hidden", "true");
      }, reduceMotion ? 20 : 640);
    }
  }

  function runLoader() {
    if (!loader) {
      body.classList.add("is-loaded");
      return;
    }
    body.classList.add("is-loading");

    if (reduceMotion) {
      if (loaderCount) loaderCount.textContent = "100";
      if (loaderFill) loaderFill.style.width = "100%";
      revealSite();
      return;
    }

    const duration = 1150;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const pct = Math.round(eased * 100);
      if (loaderCount) loaderCount.textContent = String(pct);
      if (loaderFill) loaderFill.style.width = pct + "%";
      if (t < 1) {
        window.requestAnimationFrame(tick);
      } else {
        window.setTimeout(revealSite, 220);
      }
    };

    window.requestAnimationFrame(tick);
  }

  runLoader();

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const amount = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.transform = `scaleX(${amount})`;
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 18);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const open = body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  function closeServicesDropdown() {
    if (!serviceDropdown || !serviceToggle) return;
    serviceDropdown.classList.remove("is-open");
    serviceToggle.setAttribute("aria-expanded", "false");
  }

  function openServicesDropdown() {
    if (!serviceDropdown || !serviceToggle) return;
    serviceDropdown.classList.add("is-open");
    serviceToggle.setAttribute("aria-expanded", "true");
  }

  if (serviceToggle && serviceDropdown) {
    serviceToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      serviceDropdown.classList.contains("is-open") ? closeServicesDropdown() : openServicesDropdown();
    });

    document.addEventListener("click", (event) => {
      if (!serviceDropdown.contains(event.target)) {
        closeServicesDropdown();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeServicesDropdown();
        serviceToggle.focus();
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("menu-open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      if (menuToggle) menuToggle.setAttribute("aria-label", "Open menu");
      closeServicesDropdown();
    });
  });

  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -48px 0px" });
    document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
  } else {
    document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
  }

  function normalizeAppsScriptUrl(url) {
    return String(url || "")
      .trim()
      .replace(/^https:\/\/script\.google\.com\/a\/macros\/[^/]+\/s\//i, "https://script.google.com/macros/s/");
  }

  function isConfiguredAppsScriptUrl(url) {
    return /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/i.test(normalizeAppsScriptUrl(url));
  }

  function toUrlEncodedBody(data) {
    const params = new URLSearchParams();
    data.forEach((value, key) => params.append(key, value));
    return params;
  }

  function buildInquiryLines(form, data) {
    const services = data.getAll("services").filter(Boolean);
    return [
      `Name: ${data.get("name") || ""}`,
      `Business / Company: ${data.get("company") || ""}`,
      `Email: ${data.get("email") || ""}`,
      `Phone / WhatsApp: ${data.get("phone") || ""}`,
      `City / Location: ${data.get("city") || ""}`,
      `Industry: ${data.get("industry") || ""}`,
      `Services: ${services.length ? services.join(", ") : "Not selected"}`,
      `Referral: ${data.get("referral") || "Not shared"}`,
      `Source Page: ${data.get("sourcePage") || document.title}`,
      "",
      "Project brief:",
      data.get("message") || "Not shared"
    ];
  }

  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    const status = form.querySelector(".form-status");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const required = Array.from(form.querySelectorAll("[required]"));
      const missing = required.find((field) => !String(field.value || "").trim());
      const email = form.querySelector('input[type="email"]');
      const emailOk = !email || !email.value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);

      if (missing || !emailOk) {
        if (status) status.textContent = emailOk ? "Please complete the required fields." : "Please enter a valid email address.";
        (missing || email).focus();
        return;
      }

      const data = new FormData(form);
      data.append("userAgent", window.navigator.userAgent || "");
      const endpoint = normalizeAppsScriptUrl(form.dataset.appsScriptUrl);
      const submitButton = form.querySelector('[type="submit"]');

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
      }

      if (isConfiguredAppsScriptUrl(endpoint)) {
        try {
          if (status) status.textContent = "Sending your inquiry...";
          await fetch(endpoint, {
            method: "POST",
            mode: "no-cors",
            body: toUrlEncodedBody(data)
          });
          if (status) status.textContent = "Thank you. Your inquiry has been submitted.";
          form.reset();
        } catch (error) {
          if (status) status.textContent = "We could not submit the form. Please use WhatsApp or email.";
        } finally {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.removeAttribute("aria-busy");
          }
        }
        return;
      }

      const lines = buildInquiryLines(form, data);
      if (status) status.textContent = "Opening your email app with the inquiry ready to send. Add your Apps Script URL later for direct form capture.";
      window.location.href = `mailto:design@coloursandpatterns.in?subject=${encodeURIComponent("New project inquiry for Colours & Patterns")}&body=${encodeURIComponent(lines.join("\n"))}`;
      form.reset();
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
      }
    });
  });

  yearTargets.forEach((item) => {
    item.textContent = new Date().getFullYear();
  });

  document.querySelectorAll(".marquee-track").forEach((track) => {
    Array.from(track.children).forEach((logo) => {
      const clone = logo.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  });

  // WhatsApp chat widget
  const waTrigger = document.querySelector("[data-wa-trigger]");
  const waWrap    = document.querySelector("[data-wa-wrap]");
  const waClose   = document.querySelector("[data-wa-close]");
  const waBack    = document.querySelector("[data-wa-backdrop]");

  if (waTrigger && waWrap) {
    function waOpen() {
      waWrap.classList.add("is-open");
      waWrap.setAttribute("aria-hidden", "false");
      waTrigger.setAttribute("aria-expanded", "true");
      waTrigger.style.visibility = "hidden";
    }

    function waCloseWidget() {
      waWrap.classList.remove("is-open");
      waWrap.setAttribute("aria-hidden", "true");
      waTrigger.setAttribute("aria-expanded", "false");
      waTrigger.style.visibility = "visible";
    }

    waTrigger.addEventListener("click", waOpen);
    if (waClose) waClose.addEventListener("click", function (e) { e.preventDefault(); waCloseWidget(); });
    if (waBack)  waBack.addEventListener("click", waCloseWidget);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && waWrap.classList.contains("is-open")) waCloseWidget();
    });

    if (!reduceMotion) {
      setTimeout(waOpen, 3500);
    }
  }
})();
