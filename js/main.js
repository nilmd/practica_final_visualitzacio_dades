document.addEventListener("DOMContentLoaded", async () => {
  const path = "global_power_plant_database.csv";
  try {
    const plants = await DataLoader.loadCSV(path);
    const appData = Preprocessing.preprocess(plants);

    Hero.renderKPIs(appData);
    Insights.render(appData);

    const treemapState = Filters.createState();
    const mapState = Filters.createState();
    mapState.minCapacity = 0;

    setupSectionFilters({
      state: treemapState,
      options: appData.filterOptions,
      controls: {
        country: "treemap-country-input",
        fuel: "treemap-fuel-input",
        owner: "treemap-owner-input",
      },
      onChange: () => {
        Treemap.createTreemap(appData.plants, {
          state: treemapState,
          onFuelSelect: (fuel) => {
            treemapState.fuel = fuel;
            syncInputValue("treemap-fuel-input", fuel);
            renderTreemap();
          },
        });
      },
    });

    setupSectionFilters({
      state: mapState,
      options: appData.filterOptions,
      controls: {
        country: "map-country-input",
        fuel: "map-fuel-input",
        owner: "map-owner-input",
        minCapacity: "filter-min-cap",
      },
      onChange: () => {
        if (playTimer) {
          stopPlayback(true);
          return;
        }
        renderMap();
      },
    });

    const mapControls = {
      playButton: document.getElementById("map-play-button"),
      yearLabel: document.getElementById("map-year-value"),
      minCapValue: document.getElementById("filter-min-cap-value"),
    };

    let playTimer = null;
    let playYears = [];
    let playIndex = 0;

    function renderTreemap() {
      Treemap.createTreemap(appData.plants, {
        state: treemapState,
        onFuelSelect: (fuel) => {
          treemapState.fuel = fuel;
          syncInputValue("treemap-fuel-input", fuel);
          renderTreemap();
        },
      });
    }

    function getPlayableYears() {
      const subset = Filters.filterPlants(appData.plants, {
        country_long: mapState.country_long || "",
        fuel: mapState.fuel || "",
        owner: mapState.owner || "",
        minCapacity: mapState.minCapacity || 0,
        yearCutoff: null,
      });

      return Array.from(
        new Set(
          subset
            .map((plant) =>
              plant.commissioning_year ? +plant.commissioning_year : null,
            )
            .filter((year) => year != null),
        ),
      ).sort((a, b) => a - b);
    }

    function renderMap(yearCutoff = mapState.yearCutoff) {
      MapModule.createMap(appData.plants, {
        state: mapState,
        yearCutoff,
        yearLabelEl: mapControls.yearLabel,
      });
      if (mapControls.minCapValue) {
        mapControls.minCapValue.textContent = `${mapState.minCapacity || 0} MW`;
      }
    }

    function stopPlayback(resetYearLabel = false) {
      if (playTimer) {
        clearInterval(playTimer);
        playTimer = null;
      }
      if (mapControls.playButton) {
        mapControls.playButton.textContent = "Play";
        mapControls.playButton.setAttribute("aria-pressed", "false");
      }
      if (resetYearLabel && mapControls.yearLabel) {
        mapControls.yearLabel.textContent = "Sense animació";
      }
      mapState.yearCutoff = null;
      renderMap();
    }

    function startPlayback() {
      playYears = getPlayableYears();
      if (!playYears.length) return;
      playIndex = 0;
      mapState.yearCutoff = playYears[playIndex];
      if (mapControls.playButton) {
        mapControls.playButton.textContent = "Pausa";
        mapControls.playButton.setAttribute("aria-pressed", "true");
      }
      renderMap(mapState.yearCutoff);

      playTimer = setInterval(() => {
        playIndex += 1;
        if (playIndex >= playYears.length) {
          stopPlayback(false);
          return;
        }
        mapState.yearCutoff = playYears[playIndex];
        renderMap(mapState.yearCutoff);
      }, 800);
    }

    if (mapControls.playButton) {
      mapControls.playButton.addEventListener("click", () => {
        if (playTimer) {
          stopPlayback(true);
          return;
        }
        startPlayback();
      });
    }

    renderTreemap();
    renderMap();

    setupKeyboardNavigation();
  } catch (err) {
    console.error("Error loading or rendering data", err);
    const el = document.getElementById("treemap");
    if (el)
      el.innerHTML = `<div class="text-danger">No s'ha pogut carregar o renderitzar el projecte. ${err?.message || ""}</div>`;
  }
});

function setupSectionFilters({ state, options, controls, onChange }) {
  const inputMap = {
    country_long: controls.country,
    fuel: controls.fuel,
    owner: controls.owner,
  };

  if (controls.minCapacity) {
    const minCapacityInput = document.getElementById(controls.minCapacity);
    if (minCapacityInput) {
      minCapacityInput.addEventListener("input", () => {
        state.minCapacity = minCapacityInput.value
          ? +minCapacityInput.value
          : 0;
        onChange();
      });
    }
  }

  Object.entries(inputMap).forEach(([key, inputId]) => {
    const input = document.getElementById(inputId);
    const datalist = document.getElementById(
      `${inputId.replace("-input", "-options")}`,
    );
    const values =
      options[
        key === "country_long"
          ? "countries"
          : key === "owner"
            ? "owners"
            : "fuels"
      ] || [];
    if (datalist) {
      datalist.innerHTML = values
        .map((value) => `<option value="${escapeHtml(value)}"></option>`)
        .join("");
    }
    if (input) {
      input.addEventListener("input", () => {
        state[key] = input.value.trim();
        onChange();
      });
    }
  });
}

function syncInputValue(inputId, value) {
  const input = document.getElementById(inputId);
  if (input) input.value = value || "";
}

function setupKeyboardNavigation() {
  const sectionIds = [
    "hero",
    "treemap-section",
    "map-section",
    "conclusions-section",
  ];
  document.addEventListener("keydown", (event) => {
    const active = document.activeElement;
    const typingContext =
      active &&
      ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(active.tagName);
    if (typingContext || event.metaKey || event.ctrlKey || event.altKey) return;

    if (
      !["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)
    )
      return;
    event.preventDefault();

    const currentIndex = sectionIds.findIndex((id) => {
      const section = document.getElementById(id);
      if (!section) return false;
      const rect = section.getBoundingClientRect();
      return rect.top <= 140 && rect.bottom > 140;
    });

    const nextIndex =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? Math.min(
            (currentIndex < 0 ? 0 : currentIndex) + 1,
            sectionIds.length - 1,
          )
        : Math.max((currentIndex < 0 ? 0 : currentIndex) - 1, 0);

    const nextSection = document.getElementById(sectionIds[nextIndex]);
    if (nextSection)
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
