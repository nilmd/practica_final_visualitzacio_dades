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

    // subscribe to filter changes
    Filters.subscribe((state) => {
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
  // populate countries
  const countrySel = document.getElementById("filter-country");
  const fuelSel = document.getElementById("filter-fuel");
  const minCap = document.getElementById("filter-min-cap");
  const search = document.getElementById("filter-search");

  const countries = Array.from(
    new Set(plants.map((p) => p.country).filter(Boolean)),
  ).sort();
  countrySel.innerHTML =
    "<option>All</option>" +
    countries.map((c) => `<option>${c}</option>`).join("");

  const fuels = Array.from(
    new Set(plants.map((p) => p.primary_fuel).filter(Boolean)),
  ).sort();
  fuelSel.innerHTML =
    "<option>All</option>" + fuels.map((f) => `<option>${f}</option>`).join("");

  countrySel.addEventListener("change", () =>
    Filters.set({
      country: countrySel.value === "All" ? null : countrySel.value,
    }),
  );
  fuelSel.addEventListener("change", () =>
    Filters.set({ fuel: fuelSel.value === "All" ? null : fuelSel.value }),
  );
  minCap.addEventListener("input", () =>
    Filters.set({ minCapacity: minCap.value ? +minCap.value : null }),
  );
  search.addEventListener("input", () =>
    Filters.set({ search: search.value ? search.value : null }),
  );
}
