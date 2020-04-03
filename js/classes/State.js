class State {
    constructor(stateID, name, counties, coronavirusCases, population) {
        this.stateID = stateID;
        this.counties = counties;
        this.name = name;
        this.coronavirusCases = coronavirusCases;
        this.population = population;
    }

    getCounty(countyID) {
        return this.counties[countyID];
    }

    getCountyIDs() {
        return Object.keys(this.counties);
    }

    getName() {
        return this.name;
    }

    getCoronavirusCases() {
        return this.coronavirusCases;
    }

    getPopulation() {
        return this.population;
    }

    getConfirmed() {
        return this.getCoronavirusCases().getConfirmed();
    }

    getDeaths() {
        return this.getCoronavirusCases().getDeaths();
    }

    getCountyConfirmed(stateID, populationRadioValue) {
        if (populationRadioValue === PopulationRadioButton.ACTUAL) {
            return this.getCountyActualConfirmed(stateID);
        } else if ((populationRadioValue === PopulationRadioButton.PERCENTAGE)) {
            return this.getCountyPercentageConfirmed(stateID);
        }
    }

    getCountyActualConfirmed(countyID) {
        return this.getCounty(countyID).getConfirmed();
    }

    getCountyPercentageConfirmed(countyID) {
        return this.getCounty(countyID).getPercentageConfirmed();
    }

    getPercentageCoronavirus(coronavirusRadioValue) {
        if (coronavirusRadioValue === CoronavirusCasesRadioButton.CONFIRMED) {
            return this.getPercentageConfirmed();
        } else if (coronavirusRadioValue === CoronavirusCasesRadioButton.DEATHS) {
            return this.getPercentageDeaths();
        }
    }

    getPercentageDeaths() {
        return this.getDeaths() / this.getPopulation() * 100;
    }

    getPercentageConfirmed() {
        return this.getConfirmed() / this.getPopulation() * 100;
    }

    getCountyColorScale(populationRadioValue) {
        let maxConfirmed = this.getMaxConfirmedAmongCounties(populationRadioValue);
        return d3.scaleSqrt().domain([0, maxConfirmed]).range(['beige', 'red']);
    }

    getMaxConfirmedAmongCounties(populationRadioValue) {
        if (populationRadioValue === PopulationRadioButton.ACTUAL) {
            return this.getMaxActualConfirmedAmongCounties();
        } else if ((populationRadioValue === PopulationRadioButton.PERCENTAGE)) {
            return this.getMaxPercentageConfirmedAmongCounties();
        }
    }

    getMaxActualConfirmedAmongCounties() {
        return d3.max(
            this.getCountyIDs(),
            countyID => {return this.getCountyActualConfirmed(countyID)}
        );
    }

    getMaxPercentageConfirmedAmongCounties() {
        return d3.max(
            this.getCountyIDs(),
            countyID => {return (this.getCountyPercentageConfirmed(countyID))}
        );
    }

    updateCountyColors(populationRadioValue) {
        let colorScale = this.getCountyColorScale(populationRadioValue);
        let ids = this.getCountyIDs();
        ids.forEach(id => {
            let path = $("path#"+ this.getCounty(id).getFullID() +".county-boundary");
            path.attr('fill', colorScale(this.getCountyConfirmed(id, populationRadioValue)));
        })
    }
}
