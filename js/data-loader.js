const DataLoader = (function () {
  async function loadCSV(path = "global_power_plant_database.csv") {
    // using d3.csv for simplicity
    const data = await d3.csv(path, (d) => {
      // normalize fields we expect
      d.capacity_mw =
        d.capacity_mw === undefined || d.capacity_mw === ""
          ? NaN
          : +d.capacity_mw;
      d.primary_fuel = d.primary_fuel || d.fuel || "Unknown";
      d.country = d.country || d.country_long || "Unknown";
      d.name = d.name || d.plant_name || "";
      d.commissioning_year = d.commissioning_year
        ? +d.commissioning_year
        : null;
      d.latitude = d.latitude || d.lat || d.latitude_deg || d.Latitude || "";
      d.longitude =
        d.longitude || d.lon || d.longitude_deg || d.Longitude || "";
      d.latitude = d.latitude === "" ? null : +d.latitude;
      d.longitude = d.longitude === "" ? null : +d.longitude;
      d.owner = d.owner || d.owner_name || "";
      return d;
    });
    return data;
  }

  return { loadCSV };
})();
