/* =====================================================
   SUPERMERCADO ENTRE AMIGOS — Interacciones
   JavaScript puro, sin librerías externas.
   ===================================================== */

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("#site-header");
  const menuToggle = document.querySelector("#menu-toggle");
  const mainNav = document.querySelector("#main-nav");
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const backToTop = document.querySelector("#back-to-top");
  const year = document.querySelector("#current-year");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mantiene el año del pie actualizado automáticamente.
  if (year) year.textContent = new Date().getFullYear();

  // Abre y cierra el menú móvil conservando los atributos de accesibilidad.
  const closeMenu = () => {
    if (!menuToggle || !mainNav) return;
    menuToggle.classList.remove("is-open");
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const willOpen = !mainNav.classList.contains("is-open");
      menuToggle.classList.toggle("is-open", willOpen);
      mainNav.classList.toggle("is-open", willOpen);
      menuToggle.setAttribute("aria-expanded", String(willOpen));
      menuToggle.setAttribute("aria-label", willOpen ? "Cerrar menú" : "Abrir menú");
      document.body.classList.toggle("menu-open", willOpen);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  // Cambia el aspecto de la cabecera y muestra el botón de volver arriba.
  const handleScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 10);
    backToTop?.classList.toggle("is-visible", y > 560);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  // Revelado suave de elementos al entrar en la pantalla.
  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // Marca en el menú la sección que se está consultando.
  const sections = [...document.querySelectorAll("main section[id]")];
  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
        });
      },
      { rootMargin: "-25% 0px -60%", threshold: [0, 0.2, 0.5] }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }
});

