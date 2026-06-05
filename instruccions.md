# PROJECTE: WHO GENERATES THE WORLD'S ELECTRICITY?

## Context

Develop an interactive web-based data visualization project using the Global Power Plant Database dataset.

The goal is not to build a simple dashboard, but an interactive storytelling experience that helps users understand how electricity is generated around the world.

The final application must be deployable as a static website using GitHub Pages.

---

# Technology Stack

Use:

- HTML5
- CSS3
- JavaScript ES6+
- D3.js
- Plotly.js
- Bootstrap 5

No backend required.

All data processing should happen client-side.

Dataset:

global_power_plant_database.csv

---

# Design Principles

The application should combine:

1. Storytelling
2. Interactive exploration
3. Dashboard analytics

The user should progressively discover insights while navigating the application.

The visual design should be modern, minimalist, responsive and accessible.

Use a dark theme.

---

# Main Research Question

Who generates the world's electricity and how are energy generation technologies distributed globally?

---

# Questions to Answer

1. Which energy sources dominate global installed capacity?
2. Which countries depend mostly on fossil fuels?
3. Which countries have higher renewable penetration?
4. Are there geographic patterns in energy generation technologies?
5. Which technologies are most geographically concentrated?
6. Which countries have the most diversified energy systems?
7. How is installed capacity distributed across technologies?
8. What is the relationship between number of plants and installed capacity?

---

# Application Structure

## SECTION 1 - HERO INTRODUCTION

Full screen landing section.

Title:

Who Generates the World's Electricity?

Subtitle:

Exploring the infrastructure behind global power generation.

Display animated KPI cards:

- Total power plants
- Total countries
- Total installed capacity
- Number of energy technologies

Add smooth scroll navigation.

---

## SECTION 2 - GLOBAL ENERGY MIX

Purpose:

Show which technologies dominate worldwide.

Visualization:

Treemap

Size:

capacity_mw

Color:

primary_fuel

Features:

- Hover tooltips
- Technology filtering
- Display percentage contribution

Insight panel:

Automatically display summary statistics.

---

## SECTION 3 - GLOBAL POWER PLANT MAP

Purpose:

Explore geographical distribution.

Visualization:

Interactive world map.

Each power plant represented as a point.

Point size:

capacity_mw

Point color:

primary_fuel

Controls:

- Country selector
- Fuel selector
- Capacity range slider
- Search box

Tooltip:

- Plant name
- Country
- Capacity
- Primary fuel
- Commissioning year
- Owner

---

## SECTION 4 - ENERGY DEPENDENCY BY COUNTRY

Purpose:

Identify dominant energy technologies.

Visualization:

World choropleth map.

Metric:

Dominant primary fuel per country.

Additional metric:

Percentage share of dominant fuel.

Controls:

- Select fuel
- Select region

---

## SECTION 5 - COUNTRY COMPARISON TOOL

Purpose:

Compare two countries.

Selectors:

Country A
Country B

Visualizations:

Stacked bar chart:

- Capacity by fuel type

Radar chart:

- Energy diversification

Summary cards:

- Total plants
- Total capacity
- Dominant technology
- Renewable percentage

---

## SECTION 6 - ENERGY DIVERSIFICATION ANALYSIS

Purpose:

Identify diversified vs specialized energy systems.

Create custom metric:

Diversification Index

Formula:

Shannon Diversity Index

Using fuel type shares by installed capacity.

Visualization:

Scatter plot

X:

Total installed capacity

Y:

Diversification Index

Point size:

Number of plants

Point color:

Region

Tooltip:

Country details

---

## SECTION 7 - KEY INSIGHTS

Generate dynamic narrative cards.

Example insights:

- Country with highest diversification
- Country with largest coal dependency
- Country with largest renewable share
- Largest power plant in database
- Most common technology globally

Display as storytelling cards.

---

# Global Filters

Persistent filters across sections:

- Country
- Region
- Fuel Type
- Commissioning Year Range

All charts must react to filters.

Implement cross-filtering.

---

# Data Preparation

Create preprocessing module.

Generate:

## Renewable Classification

Renewables:

- Solar
- Wind
- Hydro
- Biomass
- Geothermal
- Wave and Tidal

Non-renewables:

- Coal
- Gas
- Oil
- Nuclear
- Petcoke
- Cogeneration

Create:

is_renewable

Boolean field.

---

## Country Aggregation

Aggregate by country:

- plant_count
- total_capacity
- renewable_capacity
- renewable_share
- dominant_fuel
- diversification_index

---

## Region Aggregation

Create regions:

- Europe
- North America
- South America
- Africa
- Asia
- Oceania

---

# Accessibility

Requirements:

- Responsive design
- Keyboard navigation
- Sufficient color contrast
- Tooltips accessible
- Colorblind-friendly palette

---

# Project Structure

/project

index.html

/css
style.css

/js

data-loader.js

preprocessing.js

filters.js

hero.js

treemap.js

map.js

choropleth.js

comparison.js

diversification.js

insights.js

/main.js

/data

global_power_plant_database.csv

/assets

README.md

---

# Deployment

The application must work directly on GitHub Pages.

No server-side code.

No database.

Everything loaded from CSV.

---

# Expected Outcome

The final result should look like a professional interactive data story rather than a traditional business dashboard.

Users should be able to:

- Discover global energy patterns
- Compare countries
- Explore technologies
- Understand energy diversification
- Interact with all visualizations through linked filters

Important: everything must be in Catalan language.
