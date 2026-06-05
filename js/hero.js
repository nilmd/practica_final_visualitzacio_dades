const Hero = (function () {
  function renderKPIs(appData) {
    const stats = appData.globalStats || {};
    const cards = [
      { label: "Plantes totals", value: stats.totalPlants || 0 },
      { label: "Països", value: stats.totalCountries || 0 },
      {
        label: "Capacitat instal·lada (MW)",
        value: Math.round(stats.totalCapacity || 0).toLocaleString("ca"),
      },
      { label: "Tecnologies", value: stats.totalFuelTypes || 0 },
    ];

    const container = document.getElementById("kpi-cards");
    container.innerHTML = "";
    cards.forEach((c) => {
      const col = document.createElement("div");
      col.className = "kpi-cell";
      const card = document.createElement("div");
      card.className = "kpi-card";
      card.innerHTML = `<div class="kpi-value" data-target="${c.value}">0</div><div class="kpi-label">${c.label}</div>`;
      col.appendChild(card);
      container.appendChild(col);
    });

    const observer = new IntersectionObserver(
      (entries, io) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const values = entry.target.querySelectorAll(".kpi-value");
          values.forEach((node) => animateCount(node));
          io.disconnect();
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(container);
  }

  function animateCount(node) {
    const raw = String(node.dataset.target || "0").replace(/\./g, "");
    const target = Number(raw) || 0;
    const isLarge = target >= 1000;
    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      node.textContent = isLarge
        ? current.toLocaleString("ca")
        : String(current);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  return { renderKPIs };
})();
