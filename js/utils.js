function hoverReset() {
    if (stateView) {
        hoverShowUS();
    } else {
        hoverStates();
    }
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

function hoverShowUS() {
    changeHoverData(
        country.getName(),
        country.getCoronavirusCases().getConfirmed(),
        country.getCoronavirusCases().getDeaths(),
        country.getCoronavirusCases().getRecovered(),
        country.getPopulation(),
        country.getPercentageCoronavirus(CoronavirusCasesRadioButton.getValue())
    );
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
            state.getPercentageCoronavirus(CoronavirusCasesRadioButton.getValue())
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
            county.getPercentageCoronavirus(CoronavirusCasesRadioButton.getValue())
        );
    }
}

function changeHoverData(name, confirmed, deaths, recovered, population, percentage) {
    $("#hover-name").text(name);
    $("#hover-confirmed").text(confirmed.toLocaleString());
    $("#hover-deaths").text(deaths.toLocaleString());
    $("#hover-recovered").text(recovered.toLocaleString());
    $("#hover-population").text(parseInt(population).toLocaleString());
    if (PopulationRadioButton.getValue() === PopulationRadioButton.ACTUAL) {
        $("#hover-percentage").parent().hide();
    } else {
        let percentageLabel = $("#hover-percentage");
        console.log('percentage: ', percentage);
        percentageLabel.text(percentage.toFixed(2));
        percentageLabel.parent().show();
    }
}

function changePopulationData() {
    changeColors();
    hoverReset();
}

function changeCoronavirusData() {
    changeColors();
    hoverReset();
}

function changeColors() {
    let populationRadioValue = PopulationRadioButton.getValue();
    let coronavirusRadioValue = CoronavirusCasesRadioButton.getValue();
    if (stateView) {
        country.updateStateColors(populationRadioValue, coronavirusRadioValue);
    }
    else {
        country.updateCountyColors(currentStateID, populationRadioValue, coronavirusRadioValue);
    }
}
