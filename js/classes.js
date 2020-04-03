const PopulationRadioButton = {
    ACTUAL: "actual",
    PERCENTAGE: "percentage",

    getValue: function () {
        return $("input[name='population-radio']:checked").val();
    }
};

// const CoronavirusCasesRadioButton = {
//     CONFIRMED: "confirmed",
//     DEATHS: "deaths",
//     RECOVERED: "recovered",
//
//     getCoronavirusCasesRadioValue() {
//         return -1;
//     }
// };

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

    getPopulation() {
        return this.population;
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

    getConfirmedCases() {
        return this.getCoronavirusCases().getConfirmed();
    }

    getCountyActualConfirmedCases(countyID) {
        return this.getCounty(countyID).getConfirmedCases();
    }

    getCountyPercentageConfirmedCases(countyID) {
        return this.getCounty(countyID).getPercentageConfirmedCases();
    }

    getPercentageConfirmedCases() {
        return this.getConfirmedCases() / this.getPopulation();
    }

    // getStateConfirmedCases(stateID, populationRadioValue) {
    //     if (populationRadioValue === PopulationRadioButton.ACTUAL) {
    //         return this.getStateActualConfirmedCases(stateID);
    //     } else if ((populationRadioValue === PopulationRadioButton.PERCENTAGE)) {
    //         return this.getStatePercentageConfirmedCases(stateID);
    //     }
    // }
    //
    // getStateActualConfirmedCases(stateID) {
    //     return this.getState(stateID).getConfirmedCases();
    // }
    //
    // getStatePercentageConfirmedCases(stateID) {
    //     return this.getState(stateID).getPercentageConfirmedCases();
    // }

    getCountyColorScale(populationRadioValue) {
        let maxConfirmedCases = this.getMaxConfirmedCasesAmongCounties(populationRadioValue);
        return d3.scaleSqrt().domain([0, maxConfirmedCases]).range(['beige', 'red']);
    }

    getMaxConfirmedCasesAmongCounties(populationRadioValue) {
        if (populationRadioValue === PopulationRadioButton.ACTUAL) {
            return this.getMaxActualConfirmedCasesAmongCounties();
        } else if ((populationRadioValue === PopulationRadioButton.PERCENTAGE)) {
            return this.getMaxPercentageConfirmedCasesAmongCounties();
        }
    }

    getMaxActualConfirmedCasesAmongCounties() {
        return d3.max(
            this.getCountyIDs(),
            countyID => {return this.getCountyActualConfirmedCases(countyID)}
        );
    }

    getMaxPercentageConfirmedCasesAmongCounties() {
        return d3.max(
            this.getCountyIDs(),
            countyID => {return (this.getCountyPercentageConfirmedCases(countyID))}
        );
    }

    updateCountyColors(populationRadioValue) {
        let colorScale = this.getCountyColorScale(populationRadioValue);
        let ids = this.getCountyIDs();
        ids.forEach(id => {
            let path = $("path#"+ this.getCounty(id).getFullID() +".county-boundary");
            path.attr('fill', colorScale(this.getCountyConfirmedCases(id, populationRadioValue)));
        })
    }

    getCountyConfirmedCases(stateID, populationRadioValue) {
        if (populationRadioValue === PopulationRadioButton.ACTUAL) {
            return this.getCountyActualConfirmedCases(stateID);
        } else if ((populationRadioValue === PopulationRadioButton.PERCENTAGE)) {
            return this.getCountyPercentageConfirmedCases(stateID);
        }
    }
    //
    // getStateActualConfirmedCases(stateID) {
    //     return this.getState(stateID).getConfirmedCases();
    // }
    //
    // getStatePercentageConfirmedCases(stateID) {
    //     return this.getState(stateID).getPercentageConfirmedCases();
    // }
    //
    // getMaxConfirmedCasesAmongStates(populationRadioValue) {
    //     if (populationRadioValue === PopulationRadioButton.ACTUAL) {
    //         return this.getMaxActualConfirmedCasesAmongStates();
    //     } else if ((populationRadioValue === PopulationRadioButton.PERCENTAGE)) {
    //         return this.getMaxPercentageConfirmedCasesAmongStates();
    //     }
    // }
    //
    // getMaxActualConfirmedCasesAmongStates() {
    //     return d3.max(
    //         this.getStateIDs(),
    //         stateID => {return this.getStateActualConfirmedCases(stateID)}
    //     );
    // }
    //
    // getMaxPercentageConfirmedCasesAmongStates() {
    //     return d3.max(
    //         this.getStateIDs(),
    //         stateID => {return (this.getStatePercentageConfirmedCases(stateID))}
    //     );
    // }
    //
    // updateStateColors(populationRadioValue) {
    //     let colorScale = this.getStateColorScale(populationRadioValue);
    //     let ids = this.getStateIDs();
    //     ids.forEach(id => {
    //         let path = $("path#"+ id +".state");
    //         path.attr('fill', colorScale(this.getStateConfirmedCases(id, populationRadioValue)));
    //     });
    // }

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

    getConfirmedCases() {
        return this.getCoronavirusCases().getConfirmed();
    }

    getPercentageConfirmedCases() {
        return this.getConfirmedCases() / this.getPopulation();
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
