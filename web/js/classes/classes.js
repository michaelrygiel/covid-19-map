const PopulationRadioButton = {
    ACTUAL: "actual-radio",
    PERCENTAGE: "percentage-radio",

    getValue: function () {
        return $("input[name='population-radio']:checked").val();
    },

    getTitle: function () {
        let value = this.getValue();
        if (value === this.ACTUAL) {return "Actual"}
        if (value === this.PERCENTAGE) {return "Per 100,000"}
    }
};

const CoronavirusCasesRadioButton = {
    CONFIRMED: "confirmed-radio",
    DEATHS: "deaths-radio",
    RECOVERED: "recovered-radio",

    getValue: function () {
        return $("input[name='coronavirus-radio']:checked").val();
    },

    getTitle: function () {
        let value = this.getValue();
        if (value === this.CONFIRMED) {return "Confirmed Cases"}
        if (value === this.DEATHS) {return "Deaths"}
        if (value === this.RECOVERED) {return "Recovered"}
    }
};

const PER_ONE_HUNDRED_THOUSAND = 100000;

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
