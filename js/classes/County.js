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

    getConfirmedCases() {
        return this.getCoronavirusCases().getConfirmed();
    }

    getPercentageConfirmedCases() {
        return this.getConfirmedCases() / this.getPopulation() * 100;
    }
}
