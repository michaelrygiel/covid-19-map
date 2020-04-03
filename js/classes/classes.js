const PopulationRadioButton = {
    ACTUAL: "actual-radio",
    PERCENTAGE: "percentage-radio",

    getValue: function () {
        return $("input[name='population-radio']:checked").val();
    }
};

const CoronavirusCasesRadioButton = {
    CONFIRMED: "confirmed-radio",
    DEATHS: "deaths-radio",
    RECOVERED: "recovered-radio",

    getValue: function () {
        return $("input[name='coronavirus-radio']:checked").val();
    }
};

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
