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

    getConfirmedCases() {
        return this.getCoronavirusCases().getConfirmed();
    }

    getPopulation() {
        return this.population;
    }

    getPercentageConfirmedCases() {
        return this.getConfirmedCases() / this.getPopulation() * 100;
    }

    getStateColorScale(populationRadioValue) {
        let maxConfirmedCases = this.getMaxConfirmedCasesAmongStates(populationRadioValue);
        return d3.scaleSqrt().domain([0, maxConfirmedCases]).range(['beige', 'red']);
    }

    getStateConfirmedCases(stateID, populationRadioValue) {
        if (populationRadioValue === PopulationRadioButton.ACTUAL) {
            return this.getStateActualConfirmedCases(stateID);
        } else if ((populationRadioValue === PopulationRadioButton.PERCENTAGE)) {
            return this.getStatePercentageConfirmedCases(stateID);
        }
    }

    getStateActualConfirmedCases(stateID) {
        return this.getState(stateID).getConfirmedCases();
    }

    getStatePercentageConfirmedCases(stateID) {
        return this.getState(stateID).getPercentageConfirmedCases();
    }

    getMaxConfirmedCasesAmongStates(populationRadioValue) {
        if (populationRadioValue === PopulationRadioButton.ACTUAL) {
            return this.getMaxActualConfirmedCasesAmongStates();
        } else if ((populationRadioValue === PopulationRadioButton.PERCENTAGE)) {
            return this.getMaxPercentageConfirmedCasesAmongStates();
        }
    }

    getMaxActualConfirmedCasesAmongStates() {
        return d3.max(
            this.getStateIDs(),
            stateID => {return this.getStateActualConfirmedCases(stateID)}
        );
    }

    getMaxPercentageConfirmedCasesAmongStates() {
        return d3.max(
            this.getStateIDs(),
            stateID => {return (this.getStatePercentageConfirmedCases(stateID))}
        );
    }

    updateStateColors(populationRadioValue) {
        let colorScale = this.getStateColorScale(populationRadioValue);
        let ids = this.getStateIDs();
        ids.forEach(id => {
            let path = $("path#"+ id +".state");
            path.attr('fill', colorScale(this.getStateConfirmedCases(id, populationRadioValue)));
        });
    }

    updateCountyColors(stateID, populationRadioValue) {
        this.getState(stateID).updateCountyColors(populationRadioValue);
    }
}
