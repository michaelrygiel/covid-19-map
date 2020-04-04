class County {
    constructor(countyID, name, stateID, coronavirusCases, population) {
        this.countyID = countyID;
        this.name = name;
        this.stateID = stateID;
        this.coronavirusCases = coronavirusCases;
        this.population = population;
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

    getFullID() {
        return this.stateID + this.countyID;
    }

    getConfirmed() {
        return this.getCoronavirusCases().getConfirmed();
    }

    getPercentageConfirmed() {
        return this.getConfirmed() / this.getPopulation() * 100;
    }

    getDeaths() {
        return this.getCoronavirusCases().getDeaths();
    }

    getPercentageDeaths() {
        return this.getDeaths() / this.getPopulation() * 100;
    }

    getPercentageCoronavirus(coronavirusRadioValue) {
        if (coronavirusRadioValue === CoronavirusCasesRadioButton.CONFIRMED) {
            return this.getPercentageConfirmed();
        } else if (coronavirusRadioValue === CoronavirusCasesRadioButton.DEATHS) {
            return this.getPercentageDeaths();
        }
    }
}
