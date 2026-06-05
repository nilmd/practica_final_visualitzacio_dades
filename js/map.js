const MapModule = (function () {
  function createMap(plants) {
    const valid = plants.filter(
      (p) => p.latitude != null && p.longitude != null,
    );
    const container = d3.select("#map");
    container.selectAll("*").remove();

    const bounds = container.node().getBoundingClientRect();
    const width = Math.max(320, bounds.width || 900);
    const height = Math.max(400, bounds.height || 600);

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Mapa mundial de plantes elèctriques");

    const projection = d3.geoNaturalEarth1().fitExtent(
      [
        [20, 20],
        [width - 20, height - 20],
      ],
      { type: "Sphere" },
    );
    const path = d3.geoPath(projection);

    svg
      .append("path")
      .datum({ type: "Sphere" })
      .attr("d", path)
      .attr("fill", "#091018")
      .attr("stroke", "#2b3a45")
      .attr("stroke-width", 1.2);

    const graticule = d3.geoGraticule10();
    svg
      .append("path")
      .datum(graticule)
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.08)")
      .attr("stroke-width", 0.6);

    const fuels = valid.map((p) => p.primary_fuel || "Unknown");
    const uniqueFuels = Array.from(new Set(fuels));
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(uniqueFuels);

    const tooltip = container
      .append("div")
      .attr("class", "map-tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("background", "rgba(8, 12, 16, 0.96)")
      .style("border", "1px solid rgba(255,255,255,0.12)")
      .style("border-radius", "8px")
      .style("padding", "10px 12px")
      .style("color", "#e8eef3")
      .style("font-size", "0.88rem")
      .style("line-height", 1.4)
      .style("box-shadow", "0 10px 30px rgba(0,0,0,0.35)");

    const pointsGroup = svg.append("g");
    const points = pointsGroup
      .selectAll("circle")
      .data(valid)
      .join("circle")
      .attr("cx", (d) => projection([d.longitude, d.latitude])[0])
      .attr("cy", (d) => projection([d.longitude, d.latitude])[1])
      .attr("r", (d) =>
        Math.max(
          2,
          Math.log10((isNaN(d.capacity_mw) ? 1 : +d.capacity_mw) + 1) * 0.9,
        ),
      )
      .attr("fill", (d) => colorScale(d.primary_fuel || "Unknown"))
      .attr("fill-opacity", 0.78)
      .attr("stroke", "rgba(255,255,255,0.5)")
      .attr("stroke-width", 0.4)
      .append("title")
      .text((d) => {
        const cap = isNaN(d.capacity_mw) ? 0 : +d.capacity_mw;
        return `${d.name || "—"}\n${d.country || ""}\n${Math.round(cap).toLocaleString("ca")} MW\n${d.primary_fuel || ""}\n${d.commissioning_year || ""}\n${d.owner || ""}`;
      });

    pointsGroup
      .selectAll("circle")
      .on("mouseenter", function (event, d) {
        const cap = isNaN(d.capacity_mw) ? 0 : +d.capacity_mw;
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.name || "—"}</strong><br>${d.country || ""}<br>${Math.round(cap).toLocaleString("ca")} MW<br>${d.primary_fuel || ""}<br>${d.commissioning_year || ""}<br>${d.owner || ""}`,
          );
        d3.select(this).attr("stroke-width", 1.2).attr("fill-opacity", 1);
      })
      .on("mousemove", function (event) {
        const [x, y] = d3.pointer(event, container.node());
        tooltip.style("left", `${x + 14}px`).style("top", `${y + 14}px`);
      })
      .on("mouseleave", function () {
        tooltip.style("opacity", 0);
        d3.select(this).attr("stroke-width", 0.4).attr("fill-opacity", 0.78);
      });

    return svg.node();
  }

  function updateMap(plants) {
    // simply redraw
    createMap(plants);
  }

  return { createMap, updateMap };
})();
