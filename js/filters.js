const Filters = (function () {
  function normalizeQuery(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  function buildDatalistOptions(values) {
    return Array.from(new Set(values.filter(Boolean))).sort();
  }

  function createState() {
    return {
      country_long: "",
      fuel: "",
      owner: "",
      minCapacity: 0,
      yearCutoff: null,
    };
  }

  function matchesTextFilter(plantValue, query) {
    if (!query) return true;
    return normalizeQuery(plantValue).includes(normalizeQuery(query));
  }

  function matchesFuelFilter(plant, selectedFuel) {
    if (!selectedFuel) return true;
    return normalizeQuery(plant.primary_fuel) === normalizeQuery(selectedFuel);
  }

  function matchesSectionFilters(plant, state) {
    if (
      state.country_long &&
      !matchesTextFilter(plant.country_long, state.country_long)
    )
      return false;
    if (state.owner && !matchesTextFilter(plant.owner, state.owner))
      return false;
    if (!matchesFuelFilter(plant, state.fuel)) return false;
    if (state.minCapacity != null && !isNaN(state.minCapacity)) {
      if (isNaN(plant.capacity_mw) || +plant.capacity_mw < +state.minCapacity)
        return false;
    }
    if (state.yearCutoff != null && !isNaN(state.yearCutoff)) {
      const year = plant.commissioning_year ? +plant.commissioning_year : null;
      if (year == null) return false;
      if (year != null && year > +state.yearCutoff) return false;
    }
    return true;
  }

  function filterPlants(plants, state) {
    return plants.filter((plant) => matchesSectionFilters(plant, state));
  }

  return {
    createState,
    filterPlants,
    matchesSectionFilters,
    buildDatalistOptions,
    normalizeQuery,
  };
})();
