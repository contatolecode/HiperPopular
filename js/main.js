  /* ====== EDITE AQUI: dados reais da farmácia ====== */
  const STORE = {
    whatsapp: "554730343366",            // DDI 55 + DDD 47 + número (o mesmo número é o telefone fixo)
    ifoodUrl: "https://www.ifood.com.br/delivery/joinville-sc/farmacia-hiper-popular-fatima/a9cd075c-46e6-4d45-9d4d-bfed715e676a",   // troque pelo link da loja da farmácia no iFood
    phoneLabel: "(47) 3034-3366",
    address: "R. Fátima, 542 - Jarivatuba, Joinville - SC, 89229-102",
    mapQuery: "R. Fátima, 542 - Jarivatuba, Joinville - SC, 89229-102"
  };

  const wa = (msg) => "https://api.whatsapp.com/send?phone=" + STORE.whatsapp + "&text=" +
    encodeURIComponent(msg || "Olá! Vim pelo site da Hiper Popular.");
  document.querySelectorAll("[data-wa]").forEach(a => a.href = wa());
  document.querySelectorAll("[data-wa-msg]").forEach(a => a.href = wa(a.dataset.waMsg));
  document.querySelectorAll("[data-tel]").forEach(a => a.href = "tel:+" + STORE.whatsapp);
  document.querySelectorAll("[data-ifood]").forEach(a => a.href = STORE.ifoodUrl);
  document.querySelectorAll("[data-phone]").forEach(s => s.textContent = STORE.phoneLabel);
  document.getElementById("addr").textContent = STORE.address;
  document.getElementById("addr2").textContent = STORE.address;
  const q = encodeURIComponent(STORE.mapQuery);
  document.getElementById("mapopen").href = "https://www.google.com/maps/search/?api=1&query=" + q;
  document.getElementById("mapframe").src = "https://www.google.com/maps?q=" + q + "&z=17&hl=pt-BR&output=embed";


  /* no celular o mapa começa "travado" para não atrapalhar a rolagem da página */
  document.getElementById("mapactivate").addEventListener("click", () => document.getElementById("mapbox").classList.remove("locked"));

  /* ====== Carrossel ====== */
  (function () {
    const stage = document.getElementById("stage");
    const track = document.getElementById("track");
    const slides = [...track.children];
    const dotsBox = document.getElementById("dots");
    const caption = document.getElementById("caption");
    const captions = ["Compre sem medo", "Fini Melatonina", "Dr. Good Hair", "Nivea Óleo de Banho", "Vizzela Lapiseira Cherry"];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let i = 0, timer = null, paused = false;

    slides.forEach((_, n) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ir para o slide " + (n + 1));
      b.addEventListener("click", () => { go(n); restart(); });
      dotsBox.appendChild(b);
    });

    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = "translateX(" + (-100 * i) + "%)";
      [...dotsBox.children].forEach((d, k) => d.setAttribute("aria-current", k === i ? "true" : "false"));
      slides.forEach((s, k) => s.setAttribute("aria-hidden", k === i ? "false" : "true"));
      caption.textContent = captions[i];
    }
    function start() { if (!reduce) timer = setInterval(() => { if (!paused) go(i + 1); }, 5500); }
    function restart() { clearInterval(timer); start(); }

    document.querySelector(".car-prev").addEventListener("click", () => { go(i - 1); restart(); });
    document.querySelector(".car-next").addEventListener("click", () => { go(i + 1); restart(); });
    stage.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") { go(i - 1); restart(); }
      if (e.key === "ArrowRight") { go(i + 1); restart(); }
    });
    stage.addEventListener("mouseenter", () => paused = true);
    stage.addEventListener("mouseleave", () => paused = false);

    /* deslizar com o dedo / mouse */
    let x0 = null;
    stage.addEventListener("pointerdown", e => { x0 = e.clientX; });
    stage.addEventListener("pointerup", e => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) { go(dx < 0 ? i + 1 : i - 1); restart(); }
    });
    stage.addEventListener("pointercancel", () => { x0 = null; });

    go(0); start();
  })();


  /* ====== Marcas: linha contínua em movimento ====== */
  (function () {
    const box = document.getElementById("marquee");
    const group = box.querySelector(".marquee-group");
    const originals = [...group.children];
    const track = document.createElement("div");
    track.className = "marquee-track";
    box.appendChild(track);
    track.appendChild(group);

    function build() {
      /* repete as marcas até o grupo ser mais largo que a tela, depois duplica o grupo (loop sem emendas) */
      track.querySelectorAll(".marquee-group:not(:first-child)").forEach(g => g.remove());
      [...group.children].slice(originals.length).forEach(li => li.remove());
      const need = Math.max(window.innerWidth, 1200);
      let guard = 0;
      while (group.scrollWidth < need && guard++ < 10) originals.forEach(li => group.appendChild(li.cloneNode(true)));
      const copy = group.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      track.appendChild(copy);
      track.style.setProperty("--dur", Math.round(group.scrollWidth / 55) + "s"); /* ~55 px por segundo */
    }
    const imgs = [...box.querySelectorAll("img")];
    let pending = imgs.filter(i => !i.complete).length;
    build();
    imgs.forEach(i => i.addEventListener("load", () => { if (--pending <= 0) build(); }));
    let t; window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(build, 250); });
  })();
