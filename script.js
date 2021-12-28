const timeElement = document.getElementById('time');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const dateElement = document.getElementById('date');
const currentWeatherItemsElement = document.getElementById('current-weather-items');
const weatherForecastElement = document.getElementById('weather-forecast');
const currentTempElement = document.getElementById('current-temp');

const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag' ];
const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

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

setInterval(setTime, 1000);
setTime();