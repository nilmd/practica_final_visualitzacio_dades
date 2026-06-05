const Treemap = (function () {
  function createTreemap(plants) {
    // aggregate by primary_fuel
    const map = new Map();
    plants.forEach((p) => {
      const key = p.primary_fuel || "Unknown";
      const cap = isNaN(p.capacity_mw) ? 0 : +p.capacity_mw;
      map.set(key, (map.get(key) || 0) + cap);
    });
    const children = Array.from(map.entries()).map(([k, v]) => ({
      name: k,
      value: v,
    }));
    const root = { name: "root", children };

    const width = document.getElementById("treemap").clientWidth || 1000;
    const height = 600;
    d3.select("#treemap").selectAll("*").remove();
    const svg = d3
      .select("#treemap")
      .append("svg")
      .attr("width", "100%")
      .attr("height", height);

    const hierarchy = d3.hierarchy(root).sum((d) => d.value);
    d3.treemap().size([width, height]).padding(2)(hierarchy);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const nodes = svg
      .selectAll("g")
      .data(hierarchy.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    nodes
      .append("rect")
      .attr("width", (d) => Math.max(0, d.x1 - d.x0))
      .attr("height", (d) => Math.max(0, d.y1 - d.y0))
      .attr("fill", (d) => color(d.data.name));

    nodes
      .append("text")
      .attr("x", 4)
      .attr("y", 14)
      .text(
        (d) =>
          d.data.name +
          " (" +
          Math.round(d.data.value).toLocaleString("ca") +
          " MW)",
      )
      .style("font-size", "12px")
      .style("fill", "#fff");
  }

  return { createTreemap };
})();
