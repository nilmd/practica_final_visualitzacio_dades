# Qui genera l'electricitat del món? (Pràctica final)

Projecte de visualització interactiva desenvolupat com a pràctica final de l'assignatura de Visualització de Dades.

L'objectiu del projecte és explorar la infraestructura elèctrica mundial a partir de la **Global Power Plant Database**, combinant narrativa visual (*storytelling*) i exploració interactiva de les dades per respondre a la pregunta:

> **Qui genera l'electricitat del món?**

## Descripció del projecte

La visualització permet:

- Explorar la mescla energètica mundial.
- Analitzar la distribució geogràfica de les centrals elèctriques.
- Filtrar les dades per país, combustible, propietari i capacitat instal·lada.
- Descobrir patrons relacionats amb la transició energètica, la diversificació i les diferents estratègies energètiques dels països.

## Conjunt de dades

El projecte utilitza la **Global Power Plant Database**, una base de dades oberta desenvolupada pel World Resources Institute (WRI) que recull informació sobre més de 34.000 centrals elèctriques distribuïdes en 167 països.

Les dades inclouen, entre altres:

- Localització geogràfica
- Capacitat instal·lada (MW)
- Tipus de combustible
- Any de posada en funcionament
- Propietari
- Informació de generació elèctrica

## Estructura del projecte

```text
/
├── index.html
├── global_power_plant_database.csv
│
├── css/
│   └── style.css
│
├── js/
│   ├── data-loader.js
│   ├── preprocessing.js
│   ├── filters.js
│   ├── hero.js
│   ├── treemap.js
│   ├── map.js
│   ├── insights.js
│   └── main.js
│
└── README.md
```

## Execució local

### Requisits

- Navegador web modern
- Fitxer `global_power_plant_database.csv` situat a l'arrel del projecte

### Opció recomanada

Executar un servidor web local.

Mitjançant Python:

```bash
python3 -m http.server 8000
```

A continuació, obrir:

```text
http://localhost:8000
```

### Alternativa

Utilitzar l'extensió **Live Server** de Visual Studio Code.

## Funcionalitats implementades

### Introducció

- Indicadors principals (KPIs)
- Nombre de centrals
- Nombre de països
- Capacitat instal·lada total
- Nombre de tecnologies energètiques

### Mescla energètica

- Treemap interactiu
- Capacitat instal·lada per tecnologia
- Filtrat per país i propietari

### Distribució geogràfica

- Mapa mundial interactiu
- Zoom i desplaçament
- Tooltips informatius
- Filtrat per:
  - País
  - Combustible
  - Propietari
  - Capacitat mínima

### Conclusions

- Resum dels principals patrons observats
- Insights sobre transició energètica
- Diversificació energètica
- Distribució global de tecnologies

## Tecnologies utilitzades

- HTML5
- CSS3
- JavaScript (ES6)
- D3.js
- Bootstrap 5
- PapaParse

## Autor

Pràctica final de l'assignatura de Visualització de Dades.

Universitat Oberta de Catalunya (UOC).
