const COUNTRY_NAME = "United States";

const CoronavirusCSVColumns = {
    FIPS: "FIPS",
    CONFIRMED: "Confirmed",
    DEATHS: "Deaths",
    RECOVERED: "Recovered"
};

const StateCSVColumns = {
    STATE_ID: "STATE",
    STATE_NAME: "STATE_NAME"
};

const CountyCSVColumns = {
    COUNTY_ID: "countyID",
    STATE_ID: "stateID",
    COUNTY_NAME: "countyName"
};

const CountyPopulationCSVColumns = {
    COUNTY_ID: "COUNTY",
    STATE_ID: "STATE",
    POPULATION: "POPESTIMATE2019"
}

function generateCountry(promiseData) {
    let states = generateStatesForCountry(promiseData);
    return new Country(COUNTRY_NAME, states, generateStateOrCountryCoronavirusCases(states));
}

function generateStatesForCountry(promiseData) {
    let states = {};
    let usPopulationCSV = promiseData[1],
        coronavirusCSV = promiseData[2],
        statesCSV = promiseData[3],
        countiesCSV = promiseData[4];

    statesCSV.forEach(state => {
        let counties = generateCountiesForState(
            state[StateCSVColumns.STATE_ID],
            countiesCSV,
            coronavirusCSV,
            usPopulationCSV
        );
        states[state[StateCSVColumns.STATE_ID]] = new State(
            state[StateCSVColumns.STATE_ID],
            state[StateCSVColumns.STATE_NAME],
            counties,
            generateStateOrCountryCoronavirusCases(counties)
        );
    });
    return states;
}

function generateCountiesForState(stateID, countiesCSV, coronavirusCSV, usPopulationCSV) {
    // ADD usPopulationCSV TO THIS //
    let counties = {};
    let countiesList = countiesCSV.filter(county => county[CountyCSVColumns.STATE_ID] === stateID);
    countiesList.forEach(county => {
        let countyCoronavirusCases = generateCountyCoronavirusCases(
            county[CountyCSVColumns.COUNTY_ID],
            stateID,
            coronavirusCSV
        );
        counties[county[CountyCSVColumns.COUNTY_ID]] = new County(
            county[CountyCSVColumns.COUNTY_ID],
            county[CountyCSVColumns.COUNTY_NAME],
            stateID,
            countyCoronavirusCases
        );
    });
    return counties;
}

function generateCountyCoronavirusCases(countyID, stateID, coronavirusCSV) {
    let coronavirusCounty = coronavirusCSV.find(
        coronavirusCounty =>
            coronavirusCounty[CoronavirusCSVColumns.FIPS] === (stateID + countyID)
    );
    return coronavirusCounty
        ? new CoronavirusCases(
            parseInt(coronavirusCounty[CoronavirusCSVColumns.CONFIRMED]),
            parseInt(coronavirusCounty[CoronavirusCSVColumns.DEATHS]),
            parseInt(coronavirusCounty[CoronavirusCSVColumns.RECOVERED]))
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
