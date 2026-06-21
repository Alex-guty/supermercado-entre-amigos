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
  const chatbot = document.querySelector("#chatbot");
  const chatToggle = document.querySelector("#chat-toggle");
  const chatClose = document.querySelector("#chat-close");
  const chatMessages = document.querySelector("#chat-messages");
  const chatForm = document.querySelector("#chat-form");
  const chatInput = document.querySelector("#chat-input");
  const quickReplies = document.querySelectorAll("[data-chat-question]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mantiene el año del pie actualizado automáticamente.
  if (year) year.textContent = new Date().getFullYear();

  // Asistente local para las consultas más frecuentes del supermercado.
  const normalizeText = (text) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const getBotReply = (question) => {
    const text = normalizeText(question);

    if (/\b(hola|buenas|saludos)\b/.test(text)) {
      return "¡Hola! Puedo ayudarte con el horario, la ubicación, productos, precios o nuestros datos de contacto.";
    }
    if (/horario|hora|abren|abierto|cierran/.test(text)) {
      return "Abrimos de lunes a domingo, de 7:00 a.m. a 10:00 p.m.";
    }
    if (/ubicacion|direccion|donde|llegar|maps/.test(text)) {
      return "Estamos en El Carmen de Biolley, Buenos Aires, Puntarenas. Usa el botón “Cómo llegar” para abrir la ubicación en Google Maps.";
    }
    if (/whatsapp|telefono|numero|contacto|llamar/.test(text)) {
      return "Puedes llamarnos o escribirnos por WhatsApp al 8953-1112. El botón verde de WhatsApp abre la conversación directamente.";
    }
    if (/correo|email|e-mail/.test(text)) {
      return "Nuestro correo es supermercadoentreamigossrl@gmail.com.";
    }
    if (/precio|costo|producto|disponibilidad|existencia|oferta/.test(text)) {
      return "Para confirmar productos, precios o existencias del día, escríbenos por WhatsApp al 8953-1112 y con gusto te atendemos.";
    }
    if (/gracias|pura vida/.test(text)) {
      return "¡Con mucho gusto! Estamos para servirte.";
    }

    return "Puedo ayudarte con horario, ubicación, productos, precios, WhatsApp, teléfono o correo. Escribe una de esas opciones.";
  };

  const addChatMessage = (message, sender) => {
    if (!chatMessages) return;
    const bubble = document.createElement("p");
    bubble.className = `chat-message chat-message--${sender}`;
    bubble.textContent = message;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const askChatbot = (question) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    addChatMessage(cleanQuestion, "user");
    addChatMessage(getBotReply(cleanQuestion), "bot");
  };

  const openChat = () => {
    if (!chatbot || !chatToggle) return;
    chatbot.hidden = false;
    chatToggle.setAttribute("aria-expanded", "true");
    chatToggle.setAttribute("aria-label", "Cerrar asistente virtual");
    chatInput?.focus();
  };

  const closeChat = () => {
    if (!chatbot || !chatToggle) return;
    chatbot.hidden = true;
    chatToggle.setAttribute("aria-expanded", "false");
    chatToggle.setAttribute("aria-label", "Abrir asistente virtual");
    chatToggle.focus();
  };

  chatToggle?.addEventListener("click", () => {
    if (chatbot?.hidden) openChat();
    else closeChat();
  });
  chatClose?.addEventListener("click", closeChat);
  quickReplies.forEach((button) => {
    button.addEventListener("click", () => askChatbot(button.dataset.chatQuestion || ""));
  });
  chatForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!chatInput) return;
    askChatbot(chatInput.value);
    chatInput.value = "";
    chatInput.focus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && chatbot && !chatbot.hidden) closeChat();
  });

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
