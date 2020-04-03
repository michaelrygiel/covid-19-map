function hoverReset() {
    if (stateView) {
        hoverShowUS();
    } else {
        hoverStates();
    }
}

function hoverShowUS() {
    changeHoverData(
        country.getName(),
        country.getCoronavirusCases().getConfirmed(),
        country.getCoronavirusCases().getDeaths(),
        country.getCoronavirusCases().getRecovered(),
        country.getPopulation(),
        country.getPercentageConfirmedCases()
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
            state.getPopulation(),
            state.getPercentageConfirmedCases()
        );
    }
}

function changeCountyData(fullID) {
    let county = country.getCounty(fullID);
    if (county) {
        changeHoverData(
            county.getName(),
            county.getCoronavirusCases().getConfirmed(),
            county.getCoronavirusCases().getDeaths(),
            county.getCoronavirusCases().getRecovered(),
            county.getPopulation(),
            county.getPercentageConfirmedCases()
        );
    }
}

function changeHoverData(name, confirmed, deaths, recovered, population, percentage) {
    $("#hover-name").text(name);
    $("#hover-confirmed").text(confirmed.toLocaleString());
    $("#hover-deaths").text(deaths.toLocaleString());
    $("#hover-recovered").text(recovered.toLocaleString());
    $("#hover-population").text(parseInt(population).toLocaleString());
    if (showActualData) {
        $("#hover-percentage").parent().hide();
    } else {
        $("#hover-percentage").text(percentage.toFixed(5) + '%');
        $("#hover-percentage").parent().show();
    }
}

function changePopulationData(radio) {
    if ((showActualData && radio.value === PopulationRadioButton.PERCENTAGE)
        || (!showActualData && radio.value === PopulationRadioButton.ACTUAL)) {

            showActualData = radio.value !== PopulationRadioButton.PERCENTAGE;
            changeColors();
            hoverReset();
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
