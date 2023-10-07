const express = require('express');
var cors = require('cors')
require('dotenv').config()
const app = express();

app.use(express.json());
app.use(cors())


const geoApiOptions = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key':  process.env.RAPID_API_KEY,
		'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
	}
};


app.get('/api/data', async (req, res) => {

    const lat = req.query.lat
    const lon = req.query.lon

    const currentWeatherFetch = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );

    const currentWeatherJSON = await currentWeatherFetch.json()

    const forecastFetch = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );

    const forecastJSON = await forecastFetch.json()

    const weatherData = {currentWeatherData: currentWeatherJSON, forecastData: forecastJSON}
    res.json(weatherData)

})

app.get('/api/location', async (req, res) => {

    const inputValue = req.query.inputValue
    const getData = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?minPopulation=1000000&namePrefix=${inputValue}`,
        geoApiOptions
      )
    const response = await getData.json()
    const options = response.data.map((city) => {
        return {
        value: `${city.latitude} ${city.longitude}`,
        label: `${city.name}, ${city.countryCode}`
    }})
    res.json({options})
})

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});


