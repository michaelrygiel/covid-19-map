# COVID 19 MAP

![Example Image](https://imgur.com/a/W1DajIv)

#### WHAT:

This is a display of COVID-19 data using the [D3 library][d3] within the United States. It is designed to give both a state and county view of the COVID-19 outbreak. Users can toggle between different data to get a better understanding of the spread of the outbreak.

---

## Installation

### Clone

- Clone this repo to your local machine using `https://github.com/michaelrygiel/covid-19-map`

### Setup

- Go to root directory and run `python3 -m http.server 8000`
- Open and browser and go to `http://localhost:8000/`

---

#### WHY:

Personally, it started from the [COVID-19 Global Hackathon][hackathon]. From other maps, I saw that I couldn't get a simple breakdown county-wide, along with being unable to see the percentage of people infected per county or per state. Along with this, I have always wanted to learn D3, and what better way than to try to use what I have learned from D3 courses to implement this map.

#### SOURCES:
* [USA States Map Zoom][us-map]
* [US-Atlas Topojson Data][us-atlas]
* [COVID-19 Data][us-covid]
* [US Population Data][us-population]
* [County Data][us-county]
* [State Data][us-state]


[d3]: https://d3js.org/
[hackathon]: https://covid-global-hackathon.devpost.com/
[us-map]: http://bl.ocks.org/ElefHead/ebff082d41ef8b9658059c408096f782
[us-atlas]: https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json
[us-covid]: https://github.com/CSSEGISandData/COVID-19
[us-population]: https://www2.census.gov/programs-surveys/popest/datasets/2010-2019/counties/totals/
[us-county]: https://www2.census.gov/geo/docs/reference/codes/files/national_county.txt
[us-state]: https://www2.census.gov/geo/docs/reference/state.txt

