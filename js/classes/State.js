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

    getCountyConfirmedCases(stateID, populationRadioValue) {
        if (populationRadioValue === PopulationRadioButton.ACTUAL) {
            return this.getCountyActualConfirmedCases(stateID);
        } else if ((populationRadioValue === PopulationRadioButton.PERCENTAGE)) {
            return this.getCountyPercentageConfirmedCases(stateID);
        }
    }

    getCountyActualConfirmedCases(countyID) {
        return this.getCounty(countyID).getConfirmedCases();
    }

    getCountyPercentageConfirmedCases(countyID) {
        return this.getCounty(countyID).getPercentageConfirmedCases();
    }

    getPercentageConfirmedCases() {
        return this.getConfirmedCases() / this.getPopulation()  * 100;
    }

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
}
