const timeElement = document.getElementById('time');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const dateElement = document.getElementById('date');
const weatherForecastElement = document.getElementById('weather-forecast');
const currentTempElement = document.getElementById('current-temp');

const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag' ];
const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

const API_KEY ='ca1b8088bd10efca65a69df32da525a5';

function setTime()
{
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hours = time.getHours();
    const minutes = time.getMinutes();

    const zeroHours = hours < 10 ? '0' : '';
    hoursElement.innerHTML = `${zeroHours}${hours}`;
    const zeroMinutes = minutes < 10 ? '0' : '';
    minutesElement.innerHTML = `${zeroMinutes}${minutes} Uhr`;

    dateElement.innerHTML = days[day] + ', ' + date + ' ' + months[month];
}

function getWeatherData()
{
    navigator.geolocation.getCurrentPosition((success)=>{

        let{latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&lang=de&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
        .then(res => res.json()).then(data =>{

            console.log(data);
            showWeatherData(data);
        })
    })
}

function showWeatherData(data)
{
    let otherDayForcast = '';
    data.daily.forEach((day,idx)=>
    {
        if(idx == 0)
        {
            currentTempElement.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day).locale('de').format('dddd')}</div>
                <div class="temp">${Math.round(day.temp.day)}&#176; / ${Math.round(day.temp.night)}&#176;</div>
            </div>
            `
        }
        else
        {
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).locale('de').format('dddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
                <div class="temp">${Math.round(day.temp.day)}&#176; / ${Math.round(day.temp.night)}&#176;</div>
            </div>
            `
        }
    })

    weatherForecastElement.innerHTML = otherDayForcast;
}

function showBusData(stopPointRef, currentDateTimeStr, element, fileName)
{
    fetch('sendReceiveBusData.php', {
        method: 'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        body: `stop=${stopPointRef}&time=${currentDateTimeStr}&fileName=${fileName}`
    })

    fetch(fileName)
    .then(response => response.text())
    .then(text => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "application/xml");
        
        // Lines TODO in Funktion auslagern
        const publishedLineNameElements = doc.getElementsByTagName("PublishedLineName");
        var lineElementChilds = publishedLineNameElements[0].childNodes; // Der Array Zugriff hängt von der Anzahl der abgefragten Ergebnisse ab!
        var line = lineElementChilds[0].firstChild.nodeValue;
        var lineElement = document.getElementById(element.concat('LineFirst'));
        lineElement.innerHTML = line;

        lineElementChilds = publishedLineNameElements[1].childNodes;
        line = lineElementChilds[0].firstChild.nodeValue;
        lineElement = document.getElementById(element.concat('LineSecond'));
        lineElement.innerHTML = line;

        // Stops TODO in Funktion auslagern
        const stopPointElements = doc.getElementsByTagName("StopPointName"); 
        var stopPointElementChilds = stopPointElements[0].childNodes;
        var stopString = stopPointElementChilds[0].firstChild.nodeValue;
        var stopWords = stopString.split("Göttingen "); 
        var stopElement = document.getElementById(element.concat('StopFirst'));
        stopElement.innerHTML = stopWords[1];

        stopPointElementChilds = stopPointElements[1].childNodes;
        stopString = stopPointElementChilds[0].firstChild.nodeValue;
        stopWords = stopString.split("Göttingen "); 
        stopElement = document.getElementById(element.concat('StopSecond'));
        stopElement.innerHTML = stopWords[1];

        // Depature Times TODO in Funktion auslagern
        const serviceDepartureElements = doc.getElementsByTagName("ServiceDeparture");
        var depatureString = serviceDepartureElements[0].firstChild.firstChild.nodeValue;
        var depatureWords = depatureString.split('T');
        var depatureTimeString = depatureWords[1];
        var depatureShortTimeWords = depatureTimeString.split(":00Z"); 
        var depatureElement = document.getElementById(element.concat('StopFirstTime'));
        depatureElement.innerHTML = depatureShortTimeWords[0];

        var depatureString = serviceDepartureElements[1].firstChild.firstChild.nodeValue;
        depatureWords = depatureString.split('T');
        depatureTimeString = depatureWords[1];
        depatureShortTimeWords = depatureTimeString.split(":00Z"); 
        depatureElement = document.getElementById(element.concat('StopSecondTime'));
        depatureElement.innerHTML = depatureShortTimeWords[0];

        // Destinations TODO in Funktion auslagern
        const destinationElements = doc.getElementsByTagName("DestinationText");
        var destinationElementChilds = destinationElements[0].childNodes;
        var destination = destinationElementChilds[0].firstChild.nodeValue;
        var destinationElement = document.getElementById(element.concat('DestinationFirst'));
        destinationElement.innerHTML = destination;

        destinationElementChilds = destinationElements[1].childNodes;
        destination = destinationElementChilds[0].firstChild.nodeValue;
        destinationElement = document.getElementById(element.concat('DestinationSecond'));
        destinationElement.innerHTML = destination;
        })
}

//----------------------------------------------------------------------------------------------------------------------------

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTimeString = date.toString() + "T" + time.toString() + "Z";

showBusData("de:03152:33884::2", dateTimeString, "first", "hawk.xml"); // HAWK-Campus
showBusData("de:03152:33822::2", dateTimeString, "second", "alva.xml"); // Alva Myrdal Weg
getWeatherData();
setInterval(setTime, 1000);
