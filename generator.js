const CoronavirusCSVColumns = {
    FIPS: "FIPS",
    CONFIRMED: "Confirmed",
    DEATHS: "Deaths",
    RECOVERED: "Recovered"
};

function generateCountry(promiseData) {
    let states = generateStatesForCountry(promiseData);
    return new Country("United States", states, generateStateOrCountryCoronavirusCases(states));
}

function generateStatesForCountry(promiseData) {
    let states = {};
    let usPopulationCSV = promiseData[1],
        coronavirusCSV = promiseData[2],
        statesCSV = promiseData[3],
        countiesCSV = promiseData[4];

    statesCSV.forEach(state => {
        let counties = generateCountiesForState(state["STATE"], countiesCSV, coronavirusCSV, usPopulationCSV);
        states[state["STATE"]] = new State(
            state["STATE"],
            state["STATE_NAME"],
            counties,
            generateStateOrCountryCoronavirusCases(counties)
        );
    });
    return states;
}

function generateCountiesForState(stateID, countiesCSV, coronavirusCSV, usPopulationCSV) {
    // ADD usPopulationCSV TO THIS //
    let counties = {};
    let countiesList = countiesCSV.filter(county => county["stateID"] === stateID);
    countiesList.forEach(county => {
        let countyCoronavirusCases = generateCountyCoronavirusCases(county["countyID"], stateID, coronavirusCSV);
        counties[county["countyID"]] = new County(county["countyID"], county["countyName"], stateID, countyCoronavirusCases)
    });
    return counties;
}

function generateCountyCoronavirusCases(countyID, stateID, coronavirusCSV) {
    let coronavirusCounty = coronavirusCSV.find(coronavirusCounty => coronavirusCounty["FIPS"] === (stateID + countyID));
    return coronavirusCounty
        ? new CoronavirusCases(
            parseInt(coronavirusCounty["Confirmed"]),
            parseInt(coronavirusCounty["Deaths"]),
            parseInt(coronavirusCounty["Recovered"]))
        : new CoronavirusCases();
}

function generateStateOrCountryCoronavirusCases(regions) {
    let confirmed = 0, deaths = 0, recovered = 0;
    Object.keys(regions).forEach(function (key) {
        confirmed += regions[key].getCoronavirusCases().getConfirmed();
        deaths += regions[key].getCoronavirusCases().getDeaths();
        recovered += regions[key].getCoronavirusCases().getRecovered();
    });
    return new CoronavirusCases(confirmed, deaths, recovered);
}

// function generateCountryCoronavirusCases(states) {
//     let countryConfirmed = 0, countryDeaths = 0, countryRecovered = 0;
//     Object.keys(states).forEach(function (key) {
//         countryConfirmed += states[key].getCoronavirusCases().getConfirmed();
//         countryDeaths += states[key].getCoronavirusCases().getDeaths();
//         countryRecovered += states[key].getCoronavirusCases().getRecovered();
//     });
//     return new CoronavirusCases(countryConfirmed, countryDeaths, countryRecovered);
// }
