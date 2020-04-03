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
        let ids = this.convertFullIDToStateAndCountyID(fullID);
        return this.getState(ids[0]).getCounty(ids[1]);
    }

    getCoronavirusCases() {
        return this.coronavirusCases;
    }

    getStateConfirmedCases(stateID) {
        return this.getState(stateID).getCoronavirusCases().getConfirmed();
    }

    convertFullIDToStateAndCountyID(fullID) {
        let id = fullID.toString();
        let stateID = -1;
        let countyID = -1;

        if (id.length === 5) {
            stateID = parseInt(id.substring(0, 2));
            countyID = parseInt(id.substring(2, 5));
        }
        else {
            stateID = parseInt(id.substring(0, 1));
            countyID = parseInt(id.substring(1, 4));
        }
        return [stateID, countyID];
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
        this.stateID = parseInt(stateID);
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
        this.countyID = parseInt(countyID);
        this.name = name;
        this.stateID = parseInt(stateID);
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
