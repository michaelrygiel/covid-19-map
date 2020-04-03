function hoverShowUS() {
    changeHoverData(
        country.getName(),
        country.getCoronavirusCases().getConfirmed(),
        country.getCoronavirusCases().getDeaths(),
        country.getCoronavirusCases().getRecovered(),
        country.getPopulation()
    );
}

function hoverStates(stateID) {
    if (stateView) {
        changeStateData(stateID);
    } else {
        changeStateData(currentStateID);
    }
}

function hoverCounties(fullID) {
    if (!stateView) {
        changeCountyData(fullID);
    }
}

function changeStateData(stateID){
    let state = country.getState(stateID);
    if (state) {
        changeHoverData(
            state.getName(),
            state.getCoronavirusCases().getConfirmed(),
            state.getCoronavirusCases().getDeaths(),
            state.getCoronavirusCases().getRecovered(),
            state.getPopulation()
        );
    }
}

function changeCountyData(fullID) {
    county = country.getCounty(fullID);
    if (county) {
        changeHoverData(
            county.getName(),
            county.getCoronavirusCases().getConfirmed(),
            county.getCoronavirusCases().getDeaths(),
            county.getCoronavirusCases().getRecovered(),
            county.getPopulation()
        );
    }
}

function changeHoverData(name, confirmed, deaths, recovered, population) {
    $("#name").text(name);
    $("#population").text(parseInt(population).toLocaleString());
    $("#confirmed").text(confirmed.toLocaleString());
    $("#deaths").text(deaths.toLocaleString());
    $("#recovered").text(recovered.toLocaleString());
}

function changePopulationData(radio) {
    if ((showActualData && radio.value === PopulationRadioButton.PERCENTAGE)
        || (!showActualData && radio.value === PopulationRadioButton.ACTUAL)) {

            showActualData = radio.value !== PopulationRadioButton.PERCENTAGE;
            changeColors();
    }
}

function changeColors() {
    let populationRadioValue = PopulationRadioButton.getValue();
    if (stateView) {
        country.updateStateColors(populationRadioValue);
    }
    else {
        country.updateCountyColors(currentStateID, populationRadioValue);
    }
}
