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

    getCountyCoronavirus(countyID, populationRadioValue, coronavirusRadioValue) {
        if (coronavirusRadioValue === CoronavirusCasesRadioButton.CONFIRMED) {
            return this.getCountyConfirmed(countyID, populationRadioValue);
        } else if (coronavirusRadioValue === CoronavirusCasesRadioButton.DEATHS) {
            return this.getCountyDeaths(countyID, populationRadioValue);
        }
    }

    getCountyDeaths(countyID, populationRadioValue) {
        if (populationRadioValue === PopulationRadioButton.ACTUAL) {
            return this.getCountyActualDeaths(countyID);
        } else if ((populationRadioValue === PopulationRadioButton.PERCENTAGE)) {
            return this.getCountyPercentageDeaths(countyID);
        }
    }

    getCountyConfirmed(countyID, populationRadioValue) {
        if (populationRadioValue === PopulationRadioButton.ACTUAL) {
            return this.getCountyActualConfirmed(countyID);
        } else if ((populationRadioValue === PopulationRadioButton.PERCENTAGE)) {
            return this.getCountyPercentageConfirmed(countyID);
        }
    }

    getCountyActualDeaths(countyID) {
        return this.getCounty(countyID).getDeaths();
    }

    getCountyPercentageDeaths(countyID) {
        return this.getCounty(countyID).getPercentageDeaths();
    }

    getCountyActualConfirmed(countyID) {
        return this.getCounty(countyID).getConfirmed();
    }

    getCountyPercentageConfirmed(countyID) {
        return this.getCounty(countyID).getPercentageConfirmed();
    }

    getPercentageDeaths() {
        return this.getDeaths() / this.getPopulation() * PER_ONE_HUNDRED_THOUSAND;
    }

    getPercentageConfirmed() {
        return this.getConfirmed() / this.getPopulation() * PER_ONE_HUNDRED_THOUSAND;
    }

    getCountyColorScale(populationRadioValue, coronavirusRadioValue) {
        let maxCoronavirus = this.getMaxCoronavirusAmongCounties(populationRadioValue, coronavirusRadioValue);
        return d3.scaleLinear().domain([0, maxCoronavirus]).range(['beige', 'red']);
    }

    getMaxCoronavirusAmongCounties(populationRadioValue, coronavirusRadioValue) {
        if (coronavirusRadioValue === CoronavirusCasesRadioButton.CONFIRMED) {
            return this.getMaxConfirmedAmongCounties(populationRadioValue);
        } else if (coronavirusRadioValue === CoronavirusCasesRadioButton.DEATHS) {
            return this.getMaxDeathsAmongCounties(populationRadioValue);
        }
    }

    getMaxDeathsAmongCounties(populationRadioValue) {
        if (populationRadioValue === PopulationRadioButton.ACTUAL) {
            return this.getMaxActualDeathsAmongCounties();
        } else if ((populationRadioValue === PopulationRadioButton.PERCENTAGE)) {
            return this.getMaxPercentageDeathsAmongCounties();
        }
    }

    getMaxConfirmedAmongCounties(populationRadioValue) {
        if (populationRadioValue === PopulationRadioButton.ACTUAL) {
            return this.getMaxActualConfirmedAmongCounties();
        } else if ((populationRadioValue === PopulationRadioButton.PERCENTAGE)) {
            return this.getMaxPercentageConfirmedAmongCounties();
        }
    }

    getMaxActualDeathsAmongCounties() {
        return d3.max(
            this.getCountyIDs(),
            countyID => {return this.getCountyActualDeaths(countyID)}
        );
    }

    getMaxPercentageDeathsAmongCounties() {
        return d3.max(
            this.getCountyIDs(),
            countyID => {return (this.getCountyPercentageDeaths(countyID))}
        );
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

    updateCountyColors(populationRadioValue, coronavirusRadioValue) {
        let colorScale = this.getCountyColorScale(populationRadioValue, coronavirusRadioValue);
        let ids = this.getCountyIDs();
        ids.forEach(id => {
            let path = $("path#"+ this.getCounty(id).getFullID() +".county-boundary");
            path.attr('fill', colorScale(this.getCountyCoronavirus(id, populationRadioValue, coronavirusRadioValue)));
        });
        updateLegend(colorScale);
    }
}
