function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position.coords)
            const cords = position.coords
            // gets the weather condition based on the latitude and longitude of a particular location provided that the request was successful
            getTemperatureByLocation(cords.latitude, cords.longitude)

            // if an error is encountered use the ip address of the user to gets the wether condition
        }, (error) => {
            console.log(error);
            getuserIpAddress()

        })
        // if  navigator.geolocation.getCurrentPosition is not suppoerted by the browser use user ip address
    } else {
        console.error('Geolocation is not supported by this browser.')
        getuserIpAddress()
    }
}
getUserLocation()


function getTemperatureByLocation(latitude, longitude) {
    const appId = '914d9f8bb7acd4d1553236da6fb3edfd';
    const url = 'https://api.openweathermap.org/data/2.5/weather';


    axios({
        method: 'get',
        url,
        params: {
            lat: latitude,
            lon: longitude,
            appid: appId,
            units: 'metric' //get value in deg celsuis
        }
    })
        .then((value) => {
            console.log(value)
            if(value){
                hideSpinner()
                dispalyTemperature(value.data)
            
            }
        })
        .catch((error) => console.log(error))
}

function getuserIpAddress() {
    axios({
        url: 'https://ipinfo.io',
        method: 'get',
        params: {
        token : '23122e8239e530'
        }
    })
        .then(value => {
            console.log(value);
            const location = value.data.loc

            const latAndLong = location.split(',')
            getTemperatureByLocation(latAndLong[0], latAndLong[1])
        })
        .catch(error => console.log(error))
}


function dispalyTemperature(tempDetails) {
    const weatherimage = document.querySelector('.weather-image i');
    const city = document.querySelector('.city-name')
    const country = document.querySelector('.country')
    const desc = document.querySelector('.description')
    const temperature = document.querySelector('.temp-data')


   

    const tempDescription = tempDetails.weather[0].description;
    const weatherIcon = tempDetails.weather[0].icon;
    const isDay = weatherIcon.includes('d')



    city.textContent = `${tempDetails.name},`
    country.textContent = tempDetails.sys.country
    desc.textContent = tempDescription
    temperature.textContent = Math.round(tempDetails.main.temp)


    const uppercase = tempDescription.split(" ");
    for (let i = 0; i < uppercase.length; i++) {
        uppercase[i] = uppercase[i][0].toUpperCase() + uppercase[i].substr(1);
        
    }
    
    uppercase.join(" ");

    desc.textContent = uppercase



    switch (tempDescription) {
        case 'clear sky':
            if (isDay) {
                weatherimage.classList.add('wi-day-sunny')
            } else {
                weatherimage.classList.add('wi-night-clear')
            }
            break;
        case 'few clouds':
            if (isDay) {
                weatherimage.classList.add('wi-day-cloudy')
            } else {
                weatherimage.classList.add('wi-night-alt-cloudy')
            }
            break;
        case 'scattered clouds':
            weatherimage.classList.add('wi-cloud')
            break;
        case 'broken clouds':
        case 'overcast clouds':
            weatherimage.classList.add('wi-cloudy')
            break;

        case 'light rain':
        case 'very heavy rain':
        case 'extreme rain':
        case 'moderate rain':
            if (isDay) {
                weatherimage.classList.add('wi-day-showers')
            } else {
                weatherimage.classList.add('wi-night-alt-showers')
            }
            break;

        case 'shower rain':
            weatherimage.classList.add('wi-showers')
            break;

        case 'thunderstorm':
        case 'heavy thunderstorm':
            if (isDay) {
                weatherimage.classList.add('wi-day-lightning')
            } else {
                weatherimage.classList.add('wi-night-alt-lightning')
            }
            break;

        case 'thunderstorm with light rain':
        case 'thunderstorm with rain':
        case 'thunderstorm with heavy rain':
            weatherimage.classList.add('wi-storm-showers')
            break;

        default:
            break;
    }
}


function convertCelsuisToFahrenheit(){
 let initialDegreeCelsuis =''

 document.querySelector('.desc-wrap-2 .temp-unit').addEventListener('click', (event)=>{
    const tempData =document.querySelector('.temp-data');
    const degCelsuisInt =parseInt(tempData.textContent)

    event.target.classList.toggle('temp-convert')

    if (event.target.classList.contains('temp-convert')) {
        event.target.textContent ='F';
        const fahrenheitresult =Math.round(((degCelsuisInt * 9)/5) + 32);
        initialDegreeCelsuis =tempData.textContent;
        tempData.textContent =fahrenheitresult;
        
    } else {
        event.target.textContent ='C'
        tempData.textContent =initialDegreeCelsuis
    }
 })
}

convertCelsuisToFahrenheit()

function hideSpinner(){
    document.querySelector('.loader').style.display = 'none'
    document.querySelector('.weather-content-wrap').style.display ='block'
}