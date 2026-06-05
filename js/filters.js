const Filters = (function () {
  const state = {
    country: null,
    region: null,
    fuel: null,
    minCapacity: null,
    search: null,
    yearRange: [null, null],
  };
  const subs = new Set();
  function set(updates) {
    Object.assign(state, updates);
    subs.forEach((fn) => fn(state));
  }
  function apply(plants) {
    return plants.filter((p) => {
      if (
        state.country &&
        state.country !== "All" &&
        p.country !== state.country
      )
        return false;
      if (state.fuel && state.fuel !== "All" && p.primary_fuel !== state.fuel)
        return false;
      if (state.minCapacity != null && !isNaN(state.minCapacity)) {
        if (isNaN(p.capacity_mw) || +p.capacity_mw < +state.minCapacity)
          return false;
      }
      if (state.search) {
        const q = state.search.toLowerCase();
        if (
          !(
            (p.name || "").toLowerCase().includes(q) ||
            (p.owner || "").toLowerCase().includes(q)
          )
        )
          return false;
      }
      return true;
    });
  }
  function get() {
    return { ...state };
  }
  function subscribe(fn) {
    subs.add(fn);
    return () => subs.delete(fn);
  }

  return { set, get, subscribe, apply };
})();
