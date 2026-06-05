const Treemap = (function () {
  function createTreemap(plants, options = {}) {
    const state = options.state || {};
    const filteredPlants = Filters.filterPlants(plants, {
      country_long: state.country_long || "",
      fuel: state.fuel || "",
      owner: state.owner || "",
      minCapacity: 0,
      yearCutoff: null,
    });

    const fuelTotals = Preprocessing.aggregateByFuel(filteredPlants);
    const grandTotal = fuelTotals.reduce(
      (sum, item) => sum + item.total_capacity,
      0,
    );
    const children = fuelTotals.map((item) => ({
      name: item.fuel,
      value: item.total_capacity,
      percentage: item.percentage,
    }));
    const root = { name: "root", children };

    const width = document.getElementById("treemap").clientWidth || 1000;
    const height = Math.max(
      240,
      Math.min(320, Math.round(window.innerHeight * 0.28)),
    );
    d3.select("#treemap").selectAll("*").remove();
    const svg = d3
      .select("#treemap")
      .append("svg")
      .attr("width", "100%")
      .attr("height", height);

    const hierarchy = d3.hierarchy(root).sum((d) => d.value);
    d3.treemap().size([width, height]).padding(2)(hierarchy);

    const colorMap = (window.appData && window.appData.fuelColors) || {};

    const nodes = svg
      .selectAll("g")
      .data(hierarchy.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`)
      .style("cursor", "pointer")
      .on("click", (_, d) => {
        if (typeof options.onFuelSelect === "function") {
          options.onFuelSelect(d.data.name);
        }
      });

    nodes
      .append("rect")
      .attr("width", (d) => Math.max(0, d.x1 - d.x0))
      .attr("height", (d) => Math.max(0, d.y1 - d.y0))
      .attr("fill", (d) => colorMap[d.data.name] || "#adb5bd");

    nodes.append("title").text((d) => {
      const percentage = grandTotal ? (d.data.value / grandTotal) * 100 : 0;
      return `${d.data.name}\nCapacitat: ${Math.round(d.data.value).toLocaleString("ca")} MW\nPes: ${percentage.toFixed(1)}%`;
    });

    nodes
      .append("text")
      .attr("x", 4)
      .attr("y", 14)
      .text(
        (d) =>
          `${d.data.name} · ${Math.round(d.data.value).toLocaleString("ca")} MW`,
      )
      .style("font-size", "12px")
      .style("fill", "#111");

    const insight = document.getElementById("treemap-insight");
    if (insight && fuelTotals.length) {
      const top = fuelTotals[0];
      const percentage = grandTotal
        ? (top.total_capacity / grandTotal) * 100
        : 0;
      insight.innerHTML = `
        <div class="insight-kicker">Insight de suport</div>
        <div class="insight-title">${top.fuel} domina la mescla energètica filtrada.</div>
        <div class="insight-copy">${Math.round(top.total_capacity).toLocaleString("ca")} MW, equivalent al ${percentage.toFixed(1)}% de la capacitat mostrada.</div>
      `;
    }
  }

  return { createTreemap };
})();
