class Country {
    constructor(name, states, coronavirusCases, population) {
        this.name = name;
        this.states = states;
        this.coronavirusCases = coronavirusCases;
        this.population = population;
    }

    getName() {
        return this.name;
    }

    getStates() {
        return this.states;
    }

    getStateIDs() {
        return Object.keys(this.states);
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

    getPopulation() {
        return this.population;
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

    updateStateColors() {
        let maxConfirmedCases = this.getMaxConfirmedCasesAmongStates();
        let colorScale = d3.scaleSqrt().domain([0, maxConfirmedCases]).range(['beige', 'red']);
        let ids = this.getStateIDs();
        ids.forEach(id => {
            let path = $("path#"+ id +".state");
            path.attr('fill', colorScale(this.getStateConfirmedCases(id)));
        })
    }

    updateCountyColors(stateID) {
        this.getState(stateID).updateCountyColors();
    }
}

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

    getCounties() {
        return this.counties;
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

    getCountyConfirmedCases(countyID) {
        return this.getCounty(countyID).getCoronavirusCases().getConfirmed();
    }

    getMaxConfirmedCasesAmongCounties() {
        return d3.max(
            Object.keys(this.getCounties()),
            countyID => {return +this.getCounty(countyID).getCoronavirusCases().getConfirmed()}
        );
    }

    updateCountyColors() {
        let maxConfirmedCases = this.getMaxConfirmedCasesAmongCounties();
        let colorScale = d3.scaleSqrt().domain([0, maxConfirmedCases]).range(['beige', 'red']);
        let ids = this.getCountyIDs();
        ids.forEach(id => {
            let path = $("path#"+ this.getCounty(id).getFullID() +".county-boundary");
            path.attr('fill', colorScale(this.getCountyConfirmedCases(id)));
        })
    }
}

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
