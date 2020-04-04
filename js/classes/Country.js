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

    getConfirmed() {
        return this.getCoronavirusCases().getConfirmed();
    }

    getDeaths() {
        return this.getCoronavirusCases().getDeaths();
    }

    getPopulation() {
        return this.population;
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

    getStateColorScale(populationRadioValue, coronavirusRadioValue) {
        let maxCoronavirusData = this.getMaxCoronavirusAmongStates(populationRadioValue, coronavirusRadioValue);
        return d3.scaleSqrt().domain([0, maxCoronavirusData]).range(['beige', 'red']);
    }

    getStateCoronavirus(stateID, populationRadioValue, coronavirusRadioValue) {
        if (coronavirusRadioValue === CoronavirusCasesRadioButton.CONFIRMED) {
            return this.getStateConfirmed(stateID, populationRadioValue);
        } else if (coronavirusRadioValue === CoronavirusCasesRadioButton.DEATHS) {
            return this.getStateDeaths(stateID, populationRadioValue);
        }
    }

    getStateConfirmed(stateID, populationRadioValue) {
        if (populationRadioValue === PopulationRadioButton.ACTUAL) {
            return this.getStateActualConfirmed(stateID);
        } else if (populationRadioValue === PopulationRadioButton.PERCENTAGE) {
            return this.getStatePercentageConfirmed(stateID);
        }
    }

    getStateDeaths(stateID, populationRadioValue) {
        if (populationRadioValue === PopulationRadioButton.ACTUAL) {
            return this.getStateActualDeaths(stateID);
        } else if (populationRadioValue === PopulationRadioButton.PERCENTAGE) {
            return this.getStatePercentageDeaths(stateID);
        }
    }

    getStateActualConfirmed(stateID) {
        return this.getState(stateID).getConfirmed();
    }

    getStateActualDeaths(stateID) {
        return this.getState(stateID).getDeaths();
    }

    getStatePercentageConfirmed(stateID) {
        return this.getState(stateID).getPercentageConfirmed();
    }

    getStatePercentageDeaths(stateID) {
        return this.getState(stateID).getPercentageDeaths();
    }

    getMaxCoronavirusAmongStates(populationRadioValue, coronavirusRadioValue) {
        if (coronavirusRadioValue === CoronavirusCasesRadioButton.CONFIRMED) {
            return this.getMaxConfirmedAmongStates(populationRadioValue);
        } else if (coronavirusRadioValue === CoronavirusCasesRadioButton.DEATHS) {
            return this.getMaxDeathsAmongStates(populationRadioValue);
        }
    }

    getMaxConfirmedAmongStates(populationRadioValue) {
        if (populationRadioValue === PopulationRadioButton.ACTUAL) {
            return this.getMaxActualConfirmedAmongStates();
        } else if (populationRadioValue === PopulationRadioButton.PERCENTAGE) {
            return this.getMaxPercentageConfirmedAmongStates();
        }
    }

    getMaxDeathsAmongStates(populationRadioValue) {
        if (populationRadioValue === PopulationRadioButton.ACTUAL) {
            return this.getMaxActualDeathsAmongStates();
        } else if (populationRadioValue === PopulationRadioButton.PERCENTAGE) {
            return this.getMaxPercentageDeathsAmongStates();
        }
    }

    getMaxActualConfirmedAmongStates() {
        return d3.max(
            this.getStateIDs(),
            stateID => {return this.getStateActualConfirmed(stateID)}
        );
    }
    getMaxActualDeathsAmongStates() {
        return d3.max(
            this.getStateIDs(),
            stateID => {return this.getStateActualDeaths(stateID)}
        );
    }

    getMaxPercentageConfirmedAmongStates() {
        return d3.max(
            this.getStateIDs(),
            stateID => {return (this.getStatePercentageConfirmed(stateID))}
        );
    }

    getMaxPercentageDeathsAmongStates() {
        return d3.max(
            this.getStateIDs(),
            stateID => {return (this.getStatePercentageDeaths(stateID))}
        );
    }

    updateStateColors(populationRadioValue, coronavirusRadioValue) {
        let colorScale = this.getStateColorScale(populationRadioValue, coronavirusRadioValue);
        let ids = this.getStateIDs();
        ids.forEach(id => {
            let path = $("path#"+ id +".state");
            path.attr('fill', colorScale(this.getStateCoronavirus(id, populationRadioValue, coronavirusRadioValue)));
        });
    }

    updateCountyColors(stateID, populationRadioValue, coronavirusRadioValue) {
        this.getState(stateID).updateCountyColors(populationRadioValue, coronavirusRadioValue);
    }
}
