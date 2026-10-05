const ROUTES = {
  "/": { title: "Hotel Dom Thomaz — Jaguariaíva", description: "Hotel Dom Thomaz em Jaguariaíva: hospedagem confortável, restaurante, café da manhã e fácil acesso às indústrias e aos principais atrativos do Paraná." },
  "/os-quartos": { title: "Os Quartos — Hotel Dom Thomaz", description: "Conheça os quartos do Hotel Dom Thomaz: ar-condicionado, Wi-Fi, TV LCD, frigobar, bancada de trabalho e aquecimento central." },
  "/o-hotel": { title: "O Hotel — Hotel Dom Thomaz", description: "Conheça a estrutura do Hotel Dom Thomaz: estacionamento monitorado, recepção 24 horas, lavanderia, café da manhã e atendimento para empresas." },
  "/o-restaurante": { title: "O Restaurante — Hotel Dom Thomaz", description: "Restaurante do Hotel Dom Thomaz com pratos à la carte, ingredientes frescos e grelhados preparados na hora." },
  "/contato": { title: "Contato — Hotel Dom Thomaz", description: "Entre em contato com o Hotel Dom Thomaz em Jaguariaíva por telefone, WhatsApp ou e-mail, e veja como chegar." },
  "/conheca-jaguariaiva": { title: "Conheça Jaguariaíva — Hotel Dom Thomaz", description: "Descubra Jaguariaíva, a Escarpa Devoniana, o Vale do Codó, aquatrekking, rafting, boia cross e outras experiências." },
  "/a-melhor-do-parana": { title: "A Melhor do Paraná — Hotel Dom Thomaz", description: "Uma hospedagem acolhedora para viver Jaguariaíva com conforto, praticidade e cuidado." }
};

const normalizePath = (path) => {
  const cleaned = path.replace(/\/+$/, "") || "/";
  return ROUTES[cleaned] ? cleaned : "/";
};

function updateMetadata(route) {
  const data = ROUTES[route];
  document.title = data.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", data.description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", data.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", data.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://www.hoteldomthomaz.com.br${route === "/" ? "/" : route}`);
  const schema = document.getElementById("hotel-schema");
  if (schema) schema.textContent = schema.textContent.replace(/"url":"[^"]+"/, `"url":"https://www.hoteldomthomaz.com.br${route === "/" ? "/" : route}"`);
}

function setRoute(route, push = true) {
  const normalized = normalizePath(route);
  document.documentElement.classList.add("js");
  document.querySelectorAll(".route-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.route === normalized));
  document.querySelectorAll(".desktop-nav a, .mobile-nav a, .footer-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("/")) link.classList.toggle("is-current", href === normalized);
  });
  updateMetadata(normalized);
  if (push && window.location.pathname !== normalized) window.history.pushState({}, "", normalized);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeMobileMenu() {
  document.querySelector(".mobile-nav")?.classList.remove("is-open");
  document.querySelector(".menu-toggle")?.setAttribute("aria-expanded", "false");
}

function setupNavigation() {
  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    const href = link.getAttribute("href");
    if (!ROUTES[href]) return;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      closeMobileMenu();
      setRoute(href);
    });
  });
  window.addEventListener("popstate", () => setRoute(window.location.pathname, false));
  const toggle = document.querySelector(".menu-toggle");
  toggle?.addEventListener("click", () => {
    const open = document.querySelector(".mobile-nav")?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(Boolean(open)));
  });
}

function setupGallery() {
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const close = () => {
    lightbox?.classList.remove("is-open");
    lightbox?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  };
  document.querySelectorAll(".route-panel figure img").forEach((image) => {
    image.addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
    });
  });
  lightbox?.querySelector(".lightbox-close")?.addEventListener("click", close);
  lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) close(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
}

function setupForm() {
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const message = `Olá! Meu nome é ${data.get("nome")}. Meu contato é ${data.get("contato")}. ${data.get("mensagem")}`;
    const target = `https://api.whatsapp.com/send?phone=5543920022809&text=${encodeURIComponent(message)}`;
    if (note) note.textContent = "Abrindo o WhatsApp com sua mensagem…";
    window.open(target, "_blank", "noopener");
  });
}

function boot() {
  document.getElementById("current-year").textContent = new Date().getFullYear();
  setupNavigation();
  setupGallery();
  setupForm();
  setRoute(window.location.pathname, false);
}

document.addEventListener("DOMContentLoaded", boot);
