document.addEventListener("DOMContentLoaded", async () => {
  const path = "global_power_plant_database.csv";
  try {
    const plants = await DataLoader.loadCSV(path);
    const appData = Preprocessing.preprocess(plants);
    Hero.renderKPIs(appData);
    // render filters UI
    renderFilterControls(appData.plants);

    // initial render using all plants
    const filtered = Filters.apply(appData.plants);
    Treemap.createTreemap(filtered);
    MapModule.createMap(filtered);
    Insights.render(appData);

    // subscribe to filter changes
    Filters.subscribe(() => {
      const f = Filters.apply(appData.plants);
      Treemap.createTreemap(f);
      MapModule.updateMap(f);
    });
  } catch (err) {
    console.error("Error loading or rendering data", err);
    const el = document.getElementById("treemap");
    if (el)
      el.innerHTML = `<div class="text-danger">No s'ha pogut carregar o renderitzar el projecte. ${err?.message || ""}</div>`;
  }
});

function renderFilterControls(plants) {
  const fuelSel = document.getElementById("filter-fuel");
  const minCap = document.getElementById("filter-min-cap");
  const minCapValue = document.getElementById("filter-min-cap-value");

  const fuels = Array.from(
    new Set(plants.map((p) => p.primary_fuel).filter(Boolean)),
  ).sort();
  fuelSel.innerHTML =
    "<option>All</option>" + fuels.map((f) => `<option>${f}</option>`).join("");

  fuelSel.addEventListener("change", () =>
    Filters.set({ fuel: fuelSel.value === "All" ? null : fuelSel.value }),
  );
  minCap.addEventListener("input", () => {
    const value = minCap.value ? +minCap.value : null;
    if (minCapValue) minCapValue.textContent = `${value || 0} MW`;
    Filters.set({ minCapacity: value });
  });
}
