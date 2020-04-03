function generateCountry(promiseData) {
    states = generateStatesForCountry(promiseData);
    return new Country("United States", states, generateCountryCoronavirusCases(states));
}

function generateStatesForCountry(promiseData) {
    let states = {};
    let usPopulationCSV = promiseData[1],
        coronavirusCSV = promiseData[2],
        statesCSV = promiseData[3],
        countiesCSV = promiseData[4];

    statesCSV.forEach(state => {
        let counties = generateCountiesForState(state["stateID"], countiesCSV, coronavirusCSV, usPopulationCSV);
        let coronavirusCases = generateStateCoronavirusCases(counties);
        states[parseInt(state["stateID"])] = new State(state["stateID"], state["stateName"], counties, coronavirusCases);
    });
    return states;
}

function generateCountiesForState(stateID, countiesCSV, coronavirusCSV) {
    let counties = {};
    let countiesList = countiesCSV.filter(county => county["stateID"] === stateID);
    countiesList.forEach(county => {
        let countyCoronavirusCases = generateCountyCoronavirusCases(county["countyID"], stateID, coronavirusCSV);
        counties[parseInt(county["countyID"])] = new County(county["countyID"], county["countyName"], stateID, countyCoronavirusCases)
    });
    return counties;
}

function generateCountyCoronavirusCases(countyID, stateID, coronavirusCSV) {
    let coronavirusCounty = coronavirusCSV.find(coronavirusCounty => coronavirusCounty["fips"] === (stateID + countyID));
    return coronavirusCounty
        ? new CoronavirusCases(
            parseInt(coronavirusCounty.confirmed),
            parseInt(coronavirusCounty.deaths),
            parseInt(coronavirusCounty.recovered))
        : new CoronavirusCases();
}

function generateStateCoronavirusCases(counties) {
    let stateConfirmed = 0, stateDeaths = 0, stateRecovered = 0;
    Object.keys(counties).forEach(function (key) {
        stateConfirmed += counties[key].getCoronavirusCases().getConfirmed();
        stateDeaths += counties[key].getCoronavirusCases().getDeaths();
        stateRecovered += counties[key].getCoronavirusCases().getRecovered();
    });
    return new CoronavirusCases(stateConfirmed, stateDeaths, stateRecovered);
}

function generateCountryCoronavirusCases(states) {
    let countryConfirmed = 0, countryDeaths = 0, countryRecovered = 0;
    Object.keys(states).forEach(function (key) {
        countryConfirmed += states[key].getCoronavirusCases().getConfirmed();
        countryDeaths += states[key].getCoronavirusCases().getDeaths();
        countryRecovered += states[key].getCoronavirusCases().getRecovered();
    });
    return new CoronavirusCases(countryConfirmed, countryDeaths, countryRecovered);
}
