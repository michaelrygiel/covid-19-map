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
    let usPopulationCSV = promiseData[1],
        coronavirusCSV = promiseData[2],
        statesCSV = promiseData[3],
        countiesCSV = promiseData[4];

    let states = generateStatesForCountry(usPopulationCSV, coronavirusCSV, statesCSV, countiesCSV);
    return new Country(
        COUNTRY_NAME,
        states,
        generateStateOrCountryCoronavirusCases(states),
        generateCountryPopulation(states)
    );
}

function generateStatesForCountry(usPopulationCSV, coronavirusCSV, statesCSV, countiesCSV) {
    let states = {};

    statesCSV.forEach(state => {
        let stateID = state[StateCSVColumns.STATE_ID]
        let counties = generateCountiesForState(
            stateID,
            countiesCSV,
            coronavirusCSV,
            usPopulationCSV
        );
        let statePopulation = generateStatePopulation(
            stateID,
            usPopulationCSV
        );
        states[stateID] = new State(
            stateID,
            state[StateCSVColumns.STATE_NAME],
            counties,
            generateStateOrCountryCoronavirusCases(counties),
            statePopulation
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
        let countyPopulation = generateCountyPopulation(
            county[CountyCSVColumns.COUNTY_ID],
            stateID,
            usPopulationCSV
        );
        counties[county[CountyCSVColumns.COUNTY_ID]] = new County(
            county[CountyCSVColumns.COUNTY_ID],
            county[CountyCSVColumns.COUNTY_NAME],
            stateID,
            countyCoronavirusCases,
            countyPopulation
        );
    });
    return counties;
}

function generateCountyPopulation(countyID, stateID, usPopulationCSV) {
    let countyPopulation = usPopulationCSV.find(
        countyPopulation =>
            parseInt(countyID) === parseInt(countyPopulation[CountyPopulationCSVColumns.COUNTY_ID])
            && parseInt(stateID) === parseInt(countyPopulation[CountyPopulationCSVColumns.STATE_ID])
    );
    return countyPopulation
        ? countyPopulation[CountyPopulationCSVColumns.POPULATION]
        : 0;
}

function generateStatePopulation(stateID, usPopulationCSV) {
    const statePopulationCSVValue = 0;
    let statePopulation = usPopulationCSV.find(
        statePopulation =>
            statePopulationCSVValue === parseInt(statePopulation[CountyPopulationCSVColumns.COUNTY_ID])
            && parseInt(stateID) === parseInt(statePopulation[CountyPopulationCSVColumns.STATE_ID])
    );
    return statePopulation
        ? statePopulation[CountyPopulationCSVColumns.POPULATION]
        : 0;
}

function generateCountryPopulation(states) {
    let countryPopulation = 0;
    Object.keys(states).forEach(function (key) {
        countryPopulation += parseInt(states[key].getPopulation());
    });
    return countryPopulation.toString();
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
