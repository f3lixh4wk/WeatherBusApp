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

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&lang=de&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data =>{

            console.log(data)
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
                <div class="day">${window.moment(day).locale('de').format('dddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
                <div class="temp">${Math.round(day.temp.day)}&#176; / ${Math.round(day.temp.night)}&#176;</div>
            </div>
            `
        }
    })

    weatherForecastElement.innerHTML = otherDayForcast;
}

//----------------------------------------------------------------------------------------------------------------------------
setInterval(setTime, 1000);
setInterval(getWeatherData(), 180000);