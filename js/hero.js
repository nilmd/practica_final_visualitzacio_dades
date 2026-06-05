const Hero = (function () {
  function renderKPIs(appData) {
    const plants = appData.plants || [];
    const countries = (appData.countries || []).length;
    const totalCapacity = plants.reduce(
      (s, p) => s + (isNaN(p.capacity_mw) ? 0 : +p.capacity_mw),
      0,
    );
    const techs = new Set(plants.map((p) => p.primary_fuel));

    const cards = [
      { label: "Plantes totals", value: plants.length },
      { label: "Països", value: countries },
      {
        label: "Capacitat instal·lada (MW)",
        value: Math.round(totalCapacity).toLocaleString("ca"),
      },
      { label: "Tecnologies", value: techs.size },
    ];

    const container = document.getElementById("kpi-cards");
    container.innerHTML = "";
    cards.forEach((c) => {
      const col = document.createElement("div");
      col.className = "col-6 col-md-3";
      const card = document.createElement("div");
      card.className = "kpi-card";
      card.innerHTML = `<div class="kpi-value">${c.value}</div><div class="kpi-label">${c.label}</div>`;
      col.appendChild(card);
      container.appendChild(col);
    });
  }

  return { renderKPIs };
})();
