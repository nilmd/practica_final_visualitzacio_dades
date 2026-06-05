# Who Generates the World's Electricity? (Pràctica final)

Project scaffold for an interactive data story using the Global Power Plant Database CSV.

Quick start (open locally):

1. Ensure `global_power_plant_database.csv` is in the project root.
2. Open `index.html` in a browser (e.g., via Live Server or simple static server).

Example using Python (serve locally):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

This initial scaffold implements CSV loading, preprocessing (renewable flag, country aggregates), KPI cards and a basic treemap aggregated by fuel.
