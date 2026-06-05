const Preprocessing = (function () {
  const RENEWABLES = new Set([
    "Solar",
    "Wind",
    "Hydro",
    "Biomass",
    "Geothermal",
    "Wave and Tidal",
    "Ocean",
  ]);

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
      const c = p.country || "Unknown";
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

  function preprocess(plants) {
    // add is_renewable flag
    plants.forEach((p) => (p.is_renewable = isRenewable(p.primary_fuel)));
    const countries = aggregateByCountry(plants);
    // store for app
    window.appData = window.appData || {};
    window.appData.plants = plants;
    window.appData.countries = countries;
    return window.appData;
  }

  return { preprocess, isRenewable, shannonIndex };
})();
