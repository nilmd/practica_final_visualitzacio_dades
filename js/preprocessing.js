const Preprocessing = (function () {
  const FUEL_FIELDS = [
    "primary_fuel",
    "other_fuel1",
    "other_fuel2",
    "other_fuel3",
  ];
  const RENEWABLES = new Set([
    "Solar",
    "Wind",
    "Hydro",
    "Biomass",
    "Geothermal",
    "Wave and Tidal",
    "Ocean",
  ]);

  const FUEL_COLORS = {
    Coal: "#2f3437",
    Gas: "#3a86ff",
    Hydro: "#00b4d8",
    Solar: "#f4c542",
    Wind: "#2fb344",
    Nuclear: "#8e44ad",
    Biomass: "#a26a3d",
    Oil: "#e76f51",
    Geothermal: "#c77d2b",
    Petcoke: "#5b5b5b",
    Waste: "#8d99ae",
    Storage: "#6c757d",
    Cogeneration: "#6d597a",
    "Wave and Tidal": "#4cc9f0",
    Other: "#adb5bd",
    Unknown: "#adb5bd",
  };

  function normalizeFuel(fuel) {
    const value = (fuel || "Unknown").trim();
    if (/solar/i.test(value)) return "Solar";
    if (/wind/i.test(value)) return "Wind";
    if (/hydro/i.test(value)) return "Hydro";
    if (/biomass/i.test(value)) return "Biomass";
    if (/geotherm/i.test(value)) return "Geothermal";
    if (/wave|tidal|ocean/i.test(value)) return "Wave and Tidal";
    if (/nuclear/i.test(value)) return "Nuclear";
    if (/coal/i.test(value)) return "Coal";
    if (/gas/i.test(value)) return "Gas";
    if (/oil/i.test(value)) return "Oil";
    if (/petcoke/i.test(value)) return "Petcoke";
    if (/waste/i.test(value)) return "Waste";
    if (/storage/i.test(value)) return "Storage";
    if (/cogeneration/i.test(value)) return "Cogeneration";
    if (/other/i.test(value)) return "Other";
    return value || "Unknown";
  }

  function normalizeText(value) {
    return String(value || "").trim();
  }

  function getPlantFuelValues(plant) {
    return Array.from(
      new Set(
        FUEL_FIELDS.map((field) => normalizeFuel(plant[field])).filter(
          (fuel) => fuel && fuel !== "Unknown",
        ),
      ),
    );
  }

  function buildFilterOptions(plants) {
    const countries = new Set();
    const owners = new Set();
    const fuels = new Set();

    plants.forEach((plant) => {
      countries.add(normalizeText(plant.country_long) || "Unknown");
      owners.add(normalizeText(plant.owner));
      getPlantFuelValues(plant).forEach((fuel) => fuels.add(fuel));
    });

    return {
      countries: Array.from(countries).filter(Boolean).sort(),
      owners: Array.from(owners).filter(Boolean).sort(),
      fuels: Array.from(fuels).filter(Boolean).sort(),
    };
  }

  function isRenewable(fuel) {
    if (!fuel) return false;
    return (
      RENEWABLES.has(fuel) ||
      /solar|wind|hydro|biomass|geotherm|tidal|wave/i.test(fuel)
    );
  }

  function shannonIndex(shares) {
    // shares: array of fractions summing to 1
    return -shares.reduce(
      (acc, p) => (p > 0 ? acc + p * Math.log2(p) : acc),
      0,
    );
  }

  function aggregateByCountry(plants) {
    const byCountry = new Map();
    plants.forEach((p) => {
      const c = p.country_long || "Unknown";
      if (!byCountry.has(c))
        byCountry.set(c, {
          country: c,
          plant_count: 0,
          total_capacity: 0,
          renewable_capacity: 0,
          fuels: new Map(),
        });
      const entry = byCountry.get(c);
      entry.plant_count += 1;
      const cap = isNaN(p.capacity_mw) ? 0 : p.capacity_mw;
      entry.total_capacity += cap;
      if (isRenewable(p.primary_fuel)) entry.renewable_capacity += cap;
      const fuel = p.primary_fuel || "Unknown";
      entry.fuels.set(fuel, (entry.fuels.get(fuel) || 0) + cap);
    });

    const result = [];
    for (const [k, v] of byCountry.entries()) {
      const fuelShares = Array.from(v.fuels.entries()).sort(
        (a, b) => b[1] - a[1],
      );
      const dominant = fuelShares.length ? fuelShares[0][0] : null;
      const shares = fuelShares.map((f) =>
        v.total_capacity ? f[1] / v.total_capacity : 0,
      );
      const diversification_index = shannonIndex(shares);
      result.push({
        country: v.country,
        plant_count: v.plant_count,
        total_capacity: +v.total_capacity,
        renewable_capacity: +v.renewable_capacity,
        renewable_share: v.total_capacity
          ? v.renewable_capacity / v.total_capacity
          : 0,
        dominant_fuel: dominant,
        diversification_index,
      });
    }
    return result;
  }

  function aggregateByFuel(plants) {
    const totals = new Map();
    let grandTotal = 0;
    plants.forEach((plant) => {
      const fuel = plant.primary_fuel || "Unknown";
      const cap = isNaN(plant.capacity_mw) ? 0 : plant.capacity_mw;
      totals.set(fuel, (totals.get(fuel) || 0) + cap);
      grandTotal += cap;
    });

    return Array.from(totals.entries())
      .map(([fuel, total_capacity]) => ({
        fuel,
        total_capacity,
        percentage: grandTotal ? total_capacity / grandTotal : 0,
      }))
      .sort((a, b) => b.total_capacity - a.total_capacity);
  }

  function buildGlobalStats(plants, countries, fuels) {
    const totalCapacity = plants.reduce(
      (sum, plant) => sum + (isNaN(plant.capacity_mw) ? 0 : plant.capacity_mw),
      0,
    );
    return {
      totalPlants: plants.length,
      totalCountries: countries.length,
      totalCapacity,
      totalFuelTypes: fuels.length,
    };
  }

  function preprocess(plants) {
    // add is_renewable flag
    plants.forEach((p) => {
      p.country_long =
        normalizeText(p.country_long) || normalizeText(p.country) || "Unknown";
      p.primary_fuel = normalizeFuel(p.primary_fuel);
      p.other_fuel1 = normalizeFuel(p.other_fuel1);
      p.other_fuel2 = normalizeFuel(p.other_fuel2);
      p.other_fuel3 = normalizeFuel(p.other_fuel3);
      p.fuel_values = getPlantFuelValues(p);
      p.is_renewable = isRenewable(p.primary_fuel);
    });
    const countries = aggregateByCountry(plants);
    const fuels = aggregateByFuel(plants);
    const globalStats = buildGlobalStats(plants, countries, fuels);
    // store for app
    window.appData = window.appData || {};
    window.appData.plants = plants;
    window.appData.countries = countries;
    window.appData.fuels = fuels;
    window.appData.filterOptions = buildFilterOptions(plants);
    window.appData.globalStats = globalStats;
    window.appData.fuelColors = FUEL_COLORS;
    return window.appData;
  }

  return {
    preprocess,
    isRenewable,
    shannonIndex,
    normalizeFuel,
    aggregateByFuel,
    buildFilterOptions,
    getPlantFuelValues,
  };
})();
