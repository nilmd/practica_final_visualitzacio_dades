const Insights = (function () {
  function render(appData) {
    const countries = appData.countries || [];
    const fuels = appData.fuels || [];
    const plants = appData.plants || [];

    const mostDiversified = [...countries].sort(
      (a, b) => b.diversification_index - a.diversification_index,
    )[0];
    const largestRenewable = [...countries].sort(
      (a, b) => b.renewable_share - a.renewable_share,
    )[0];
    const largestCoal = [...countries].sort((a, b) => {
      const aCoal = coalShareForCountry(a.country, plants);
      const bCoal = coalShareForCountry(b.country, plants);
      return bCoal - aCoal;
    })[0];
    const largestCapacityPlant = [...plants].sort(
      (a, b) => (b.capacity_mw || 0) - (a.capacity_mw || 0),
    )[0];
    const mostCommonTechnology = fuels[0];

    const cards = [
      {
        kicker: "Diversificació",
        title: mostDiversified ? mostDiversified.country : "—",
        copy: mostDiversified
          ? `És el país amb l'índex de diversificació més alt del conjunt de dades.`
          : "No hi ha dades suficients.",
      },
      {
        kicker: "Renovables",
        title: largestRenewable ? largestRenewable.country : "—",
        copy: largestRenewable
          ? `Té la proporció més alta de capacitat renovable: ${(largestRenewable.renewable_share * 100).toFixed(1)}%.`
          : "No hi ha dades suficients.",
      },
      {
        kicker: "Dependència fòssil",
        title: largestCoal ? largestCoal.country : "—",
        copy: largestCoal
          ? `Concentra la dependència més alta del carbó dins del conjunt analitzat.`
          : "No hi ha dades suficients.",
      },
      {
        kicker: "Gran planta",
        title: largestCapacityPlant ? largestCapacityPlant.name : "—",
        copy: largestCapacityPlant
          ? `${largestCapacityPlant.country || ""} · ${Math.round(largestCapacityPlant.capacity_mw || 0).toLocaleString("ca")} MW.`
          : "No hi ha dades suficients.",
      },
      {
        kicker: "Tecnologia dominant",
        title: mostCommonTechnology ? mostCommonTechnology.fuel : "—",
        copy: mostCommonTechnology
          ? `És la tecnologia amb més capacitat instal·lada al món.`
          : "No hi ha dades suficients.",
      },
    ];

    const container = document.getElementById("insights-cards");
    if (!container) return;
    container.innerHTML = cards
      .map(
        (card) => `
          <article class="insight-card">
            <div class="insight-kicker">${card.kicker}</div>
            <div class="insight-title">${card.title}</div>
            <div class="insight-copy">${card.copy}</div>
          </article>
        `,
      )
      .join("");
  }

  function coalShareForCountry(country, plants) {
    const countryPlants = plants.filter((plant) => plant.country === country);
    const coal = countryPlants
      .filter((plant) => plant.primary_fuel === "Coal")
      .reduce(
        (sum, plant) =>
          sum + (isNaN(plant.capacity_mw) ? 0 : plant.capacity_mw),
        0,
      );
    const total = countryPlants.reduce(
      (sum, plant) => sum + (isNaN(plant.capacity_mw) ? 0 : plant.capacity_mw),
      0,
    );
    return total ? coal / total : 0;
  }

  return { render };
})();
