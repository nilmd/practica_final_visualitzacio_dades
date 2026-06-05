const MapModule = (function () {
  function createMap(plants, options = {}) {
    const valid = plants.filter(
      (p) => p.latitude != null && p.longitude != null,
    );
    const yearCutoff = options.yearCutoff == null ? null : +options.yearCutoff;
    const state = options.state || {};
    const filtered = Filters.filterPlants(valid, {
      country_long: state.country_long || "",
      fuel: state.fuel || "",
      owner: state.owner || "",
      minCapacity: state.minCapacity || 0,
      yearCutoff,
    });
    const container = d3.select("#map");
    container.selectAll("*").remove();

    const bounds = container.node().getBoundingClientRect();
    const width = Math.max(320, bounds.width || 900);
    const height = Math.max(
      280,
      Math.min(360, Math.round(window.innerHeight * 0.34)),
    );

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
    const zoomGroup = svg.append("g");

    zoomGroup
      .append("path")
      .datum({ type: "Sphere" })
      .attr("d", path)
      .attr("fill", "#f3f2ed")
      .attr("stroke", "rgba(17,17,17,0.25)")
      .attr("stroke-width", 1.2);

    const graticule = d3.geoGraticule10();
    zoomGroup
      .append("path")
      .datum(graticule)
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "rgba(17,17,17,0.08)")
      .attr("stroke-width", 0.6);

    const colorMap = (window.appData && window.appData.fuelColors) || {};

    const tooltip = container
      .append("div")
      .attr("class", "map-tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("background", "rgba(255, 255, 255, 0.96)")
      .style("border", "1px solid rgba(17,17,17,0.12)")
      .style("border-radius", "8px")
      .style("padding", "10px 12px")
      .style("color", "#111111")
      .style("font-size", "0.88rem")
      .style("line-height", 1.4)
      .style("box-shadow", "0 10px 30px rgba(0,0,0,0.18)");

    const pointsGroup = zoomGroup.append("g");
    pointsGroup
      .selectAll("circle")
      .data(filtered)
      .join("circle")
      .attr("cx", (d) => projection([d.longitude, d.latitude])[0])
      .attr("cy", (d) => projection([d.longitude, d.latitude])[1])
      .attr("r", (d) =>
        Math.max(
          2,
          Math.log10((isNaN(d.capacity_mw) ? 1 : +d.capacity_mw) + 1) * 0.9,
        ),
      )
      .attr("fill", (d) => colorMap[d.primary_fuel || "Unknown"] || "#adb5bd")
      .attr("fill-opacity", 0.78)
      .attr("stroke", "rgba(17,17,17,0.35)")
      .attr("stroke-width", 0.4)
      .append("title")
      .text((d) => {
        const cap = isNaN(d.capacity_mw) ? 0 : +d.capacity_mw;
        return `${d.name || "—"}\n${d.country_long || ""}\n${Math.round(cap).toLocaleString("ca")} MW\n${d.primary_fuel || ""}\n${d.commissioning_year || ""}\n${d.owner || ""}`;
      });

    pointsGroup
      .selectAll("circle")
      .on("mouseenter", function (event, d) {
        const cap = isNaN(d.capacity_mw) ? 0 : +d.capacity_mw;
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.name || "—"}</strong><br>${d.country_long || ""}<br>${Math.round(cap).toLocaleString("ca")} MW<br>${d.primary_fuel || ""}<br>${d.commissioning_year || ""}<br>${d.owner || ""}`,
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

    svg.call(
      d3
        .zoom()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {
          zoomGroup.attr("transform", event.transform);
        }),
    );

    if (options.yearLabelEl) {
      options.yearLabelEl.textContent = yearCutoff
        ? `Fins a ${yearCutoff}`
        : "Sense animació";
    }

    return svg.node();
  }

  function updateMap(plants, options = {}) {
    // simply redraw
    createMap(plants, options);
  }

  return { createMap, updateMap };
})();
