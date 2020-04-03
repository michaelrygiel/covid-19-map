class Country {
    constructor(name, states, coronavirusCases) {
        this.name = name;
        this.states = states;
        this.coronavirusCases = coronavirusCases;
    }

    getName() {
        return this.name;
    }

    getStates() {
        return this.states;
    }

    getState(stateID) {
        return this.states[stateID];
    }

    getCounty(fullID) {
        return this.getState(fullID.substring(0,2)).getCounty(fullID.substring(2,5));
    }

    getCoronavirusCases() {
        return this.coronavirusCases;
    }

    getStateConfirmedCases(stateID) {
        return this.getState(stateID).getCoronavirusCases().getConfirmed();
    }

    getMaxConfirmedCasesAmongStates() {
        return d3.max(
            Object.keys(this.getStates()),
            stateID => {return +this.getState(stateID).getCoronavirusCases().getConfirmed()}
        );
    }
}

class State {
    /*
    Variables
        stateID
        stateName
        counties
        population
        CoronavirusCases
     */
    constructor(stateID, name, counties, coronavirusCases) {
        this.stateID = stateID;
        this.counties = counties;
        this.name = name;
        this.coronavirusCases = coronavirusCases;
    }

    getCounty(countyID) {
        return this.counties[countyID];
    }

    getCounties() {
        return this.counties;
    }

    getName() {
        return this.name;
    }

    getCoronavirusCases() {
        return this.coronavirusCases;
    }

    getCountyWithMaxConfirmedCases() {
        return d3.max(
            Object.keys(this.getCounties()),
            countyID => {return +this.getCounty(countyID).getCoronavirusCases().getConfirmed()}
        );
    }
}

class County {
    /*
    Variables
        countyID
        countyName
        stateID
        population
        CoronavirusCases
     */
    constructor(countyID, name, stateID, coronavirusCases) {
        this.countyID = countyID;
        this.name = name;
        this.stateID = stateID;
        this.coronavirusCases = coronavirusCases;
    }

    getName() {
        return this.name;
    }

    getCoronavirusCases() {
        return this.coronavirusCases;
    }
}

class CoronavirusCases {
    constructor(confirmed, deaths, recovered) {
        this.confirmed = isNaN(confirmed) ? 0: confirmed;
        this.deaths = isNaN(deaths) ? 0 : deaths;
        this.recovered = isNaN(recovered) ? 0 : recovered;
    }

    getConfirmed() {
        return this.confirmed;
    }

    getDeaths() {
        return this.deaths;
    }

    getRecovered() {
        return this.recovered;
    }
}
