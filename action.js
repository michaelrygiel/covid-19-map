const rp = require('request-promise');
const fs = require('fs');
const path = require('path');
const baseUrl = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/";
const coronavirusFilename = "coronavirusCountyData";
const dataFolder = 'web/data/';
const pathToData = path.join(__dirname, dataFolder, coronavirusFilename) + '.csv';


function getYesterday() {
    let today = new Date();
    let yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    let dd = yesterday.getDate();

    let mm = yesterday.getMonth()+1;
    const yyyy = yesterday.getFullYear();
    if(dd<10)
    {
        dd=`0${dd}`;
    }

    if(mm<10)
    {
        mm=`0${mm}`;
    }
    yesterday = mm+'-'+dd+'-'+yyyy;
    return yesterday;
}

let url = baseUrl + getYesterday() + '.csv';

rp(url)
    .then(function(coronavirusDataCSV){
        fs.writeFile(pathToData, coronavirusDataCSV.toString(), 'utf8', function (err) {
            if (err) {
                console.log('Some error occured - file either not saved or corrupted file saved: ' + err);
            } else{
                console.log('File written!');
            }
        });
    })
    .catch(function(err){
        console.log("error:" + err);
        throw new Error(err);
    });
